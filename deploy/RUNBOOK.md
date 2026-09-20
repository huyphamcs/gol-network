# GOL Network deployment runbook

This is the repeatable operator procedure for the GOL application, Arc testnet
contracts, and the external Graph Studio subgraph. It is intentionally CLI-first:
the production host is managed over SSH and no SSM session is required.

## 1. Production map

| Item                            | Value                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| Repository                      | `https://github.com/Gol-Network/gol-network.git`                      |
| Production host                 | `ec2-user@16.76.174.242`                                              |
| EC2 instance                    | `i-0551fb8ae101f65d0` (`gol-production`)                              |
| AWS region                      | `ap-northeast-1`                                                      |
| Public app                      | `https://gol.network/app`                                             |
| Chain                           | Arc testnet (`5042002`)                                               |
| Factory (current)               | `0x229db99428ae031819cF6acF3c056588c4283B2F`                          |
| Arc USDC (current)              | `0x3600000000000000000000000000000000000000`                          |
| Factory deployment block        | `61883600`                                                            |
| Studio subgraph                 | `gol-arc-testnet`                                                     |
| Studio query endpoint (current) | `https://api.studio.thegraph.com/query/1760273/gol-arc-testnet/0.0.1` |
| Host checkout                   | `/opt/gol-network`                                                    |
| Host runtime env                | `/opt/gol-network/deploy/.env.production`                             |

The addresses above are public identifiers, not proof that a release is live.
Always verify the commit, health endpoint, and Graph response after a rollout.

## 2. Credential rules (mandatory)

- Never paste deploy keys, API keys, private keys, passwords, or secret-bearing URLs
  into chat, shell history, CI logs, or Git.
- Keep local Graph credentials in a user-only file outside the repository, for example
  `<workspace-parent>/.secrets/gol-graph.env`, with mode `0600`:

  ```text
  GRAPH_SUBGRAPH_SLUG=gol-arc-testnet
  GRAPH_DEPLOY_KEY=...
  GRAPH_API_KEY=...
  GRAPH_QUERY_URL=https://api.studio.thegraph.com/query/...
  ```

- Keep the populated host file at `/opt/gol-network/deploy/.env.production` with mode
  `0600`. It must never be committed. Use `deploy/.env.example` as the field checklist.
- The deploy key is for Graph CLI deployment. The API key is for backend queries. They
  are different credentials. Rotate either one in Studio if it appears in a screenshot,
  terminal output, or chat.
- Never put AWS access keys in `.env.production`; the worker receives KMS access from
  the EC2 instance role.

## 3. Release gates before touching production

Work from a clean checkout and record the exact commit that will be deployed:

```bash
git fetch origin main
git status --short
git rev-parse HEAD
git remote -v
```

Run the narrow checks for the changed boundary, then the full checks for a release
candidate:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
forge test --root contracts -vvv
pnpm --filter @gol/subgraph codegen
pnpm --filter @gol/subgraph test
pnpm --filter @gol/subgraph build
docker compose -f deploy/docker-compose.yml config -q
pnpm format:check
git diff --check
```

Commit only reviewed source/config changes. Confirm that no populated environment file,
private key, API key, build output, or generated directory is staged:

```bash
git diff --cached --name-only
git status --short
git push origin main
```

Use one focused imperative commit per logical change. Do not rewrite published history
to hide a secret; revoke the credential and remove it in a follow-up commit instead.

## 4. Contract deployment (only when Solidity changes)

Do not redeploy the factory for a UI, API, worker, or Graph-only change. Contracts are
immutable; a new factory requires a new application/subgraph configuration and owner
mandates must point at the new account implementation.

1. Confirm the deployer is the Foundry keystore account named `gol-deployer` and that
   the RPC points to Arc testnet. Keep the keystore password and RPC credentials outside
   the repository.
2. Run the checked-in script from `contracts/`:

   ```bash
   forge test --root contracts -vvv
   forge script script/Deploy.s.sol:Deploy \
     --rpc-url "$ARC_RPC_URL" \
     --account gol-deployer \
     --broadcast \
     -vvvv
   ```

3. Record the actual factory address, transaction hash, block, bytecode hash, and source
   commit in `deployments/arc-testnet.json`. Never guess a block or address.
4. Prepare the manifest from that deployment record; the script refuses an undeployed
   record:

   ```bash
   pnpm subgraph:prepare
   pnpm --filter @gol/subgraph codegen
   pnpm --filter @gol/subgraph test
   pnpm --filter @gol/subgraph build
   ```

5. Update `FACTORY_ADDRESS` on the production host only after the new contract has been
   independently verified on Arc. A contract change is not complete until the protocol
   ABI, agent/web consumers, and subgraph manifest all agree.

## 5. Graph Studio deployment

The repository already contains the GOL manifest. Do **not** run `graph init` in this
checkout; it can scaffold over reviewed schema and mappings.

1. In Studio, create/select the subgraph `gol-arc-testnet` on **Arc testnet**.
2. Create a Deploy Key and a separate query API key. Save both in the private file from
   Section 2. Do not click **Publish** merely to obtain an API key.
3. Load the private values without printing them and deploy the prepared manifest:

   ```bash
   GRAPH_ENV_FILE="/path/to/gol-graph.env"
   set -a
   . "$GRAPH_ENV_FILE"
   set +a

   pnpm --filter @gol/subgraph codegen
   pnpm --filter @gol/subgraph build
   pnpm --filter @gol/subgraph exec graph deploy \
     "$GRAPH_SUBGRAPH_SLUG" \
     --version-label 0.0.1 \
     --deploy-key "$GRAPH_DEPLOY_KEY"
   ```

   Use the next version label (`0.0.2`, `0.0.3`, …) when updating an existing slug.

4. Copy the exact query URL returned by Studio into `GRAPH_QUERY_URL`. Verify the
   deployment before changing production:

   ```bash
   query='{ _meta { hasIndexingErrors block { number hash } } }'
   curl -fsS --max-time 20 \
     -H 'content-type: application/json' \
     -H "Authorization: Bearer $GRAPH_API_KEY" \
     --data "{\"query\":\"$query\"}" \
     "$GRAPH_QUERY_URL"
   ```

   `hasIndexingErrors` must be `false`. The indexed block must eventually reach the
   factory deployment block before expecting newly-created accounts/events. A fresh
   deployment can legitimately report an older block while it catches up.

## 6. Update production runtime configuration

Change only the necessary host-only values. For a Graph rotation/update, the required
fields are:

```text
GRAPH_QUERY_URL=https://api.studio.thegraph.com/query/<account>/<slug>/<version>
GRAPH_API_KEY=<query key>
```

Use an approved secret editor or secret-transfer procedure; never use `echo` with a
credential. Confirm the host file remains mode `0600`. Keep local and host values in sync,
then run the release procedure in Section 7 so containers receive the new environment.

## 7. Deploy the application to EC2

### Preferred path: CI-approved release

1. Push the reviewed commit to `main`.
2. Wait for the `ci` workflow to pass.
3. The `deploy-production` workflow must approve the same commit in the protected
   `production` environment. The host poller then fetches public GitHub state, checks the
   approved commit equals `origin/main`, and runs `remote-release.sh`.
4. Confirm the poller is installed and healthy on the host:

   ```bash
   sudo systemctl status gol-production-release.timer
   sudo systemctl status gol-production-release.service
   ```

### Manual SSH fallback

Use this when CI/poller is unavailable or an operator explicitly needs an immediate
release. Substitute a local path for `SSH_KEY`; never commit it.

```bash
SSH_KEY="/path/to/gol-production.bin"
SSH_HOST="ec2-user@16.76.174.242"
RELEASE_COMMIT="$(git rev-parse HEAD)"

ssh -i "$SSH_KEY" "$SSH_HOST" \
  "git -C /opt/gol-network fetch --force --prune origin main && \
   test \"\$(git -C /opt/gol-network rev-parse origin/main)\" = \"$RELEASE_COMMIT\" && \
   git -C /opt/gol-network checkout --detach \"$RELEASE_COMMIT\""

ssh -i "$SSH_KEY" "$SSH_HOST" \
  "GOL_REPO_DIR=/opt/gol-network \
   GOL_BACKUP_BUCKET=gol-production-779035457064-ap-northeast-1 \
   GOL_BACKUP_KMS_KEY_ID=alias/gol-backups \
   bash /opt/gol-network/deploy/remote-release.sh \"$RELEASE_COMMIT\""
```

`remote-release.sh` refuses a missing/dirty checkout or a commit mismatch. It serializes
releases, stops new worker claims, creates an encrypted S3 pre-deploy backup, builds the
pinned ARM-compatible images, runs idempotent migrations, activates web/worker/Caddy,
and requires the internal health check to return 200. Do not bypass it with an ad-hoc
`docker compose up` for a real release; that loses release provenance and safety checks.

## 8. Post-deploy verification

Run all checks below and record the commit/time in the release note or incident ticket:

```bash
curl -fsS https://gol.network/app/api/health
curl -fsSI https://gol.network/app

ssh -i "$SSH_KEY" "$SSH_HOST" \
  "cd /opt/gol-network && docker compose --env-file deploy/.env.production \
   -f deploy/docker-compose.yml ps"
```

Expected `/app/api/health` invariants:

- `ready: true`
- `chainId: 5042002`, `network: "arc-testnet"`, `mode: "live"`
- `sourceCommit` equals the requested release commit
- `components.graph.status: "ok"` and an advancing `indexedBlock`
- database and chain checks are healthy
- `components.signer.provider: "aws_kms"` and signer readiness is true
- `factoryConfigured: true`

Then perform a signed-out page load and one signed-in smoke flow. For a payment release,
exercise both a permitted payment and a deliberately refused payment, and confirm the
activity/query response contains the real transaction hash and refusal reason. Never use
fixtures or a screenshot as live-production evidence.

## 9. Rollback and recovery

Application rollback is a commit rollback, not a contract rollback:

```bash
PREVIOUS_COMMIT="<known-compatible-40-character-commit>"
ssh -i "$SSH_KEY" "$SSH_HOST" \
  "cd /opt/gol-network && git checkout --detach \"$PREVIOUS_COMMIT\" && \
   GOL_REPO_DIR=/opt/gol-network \
   GOL_BACKUP_BUCKET=gol-production-779035457064-ap-northeast-1 \
   GOL_BACKUP_KMS_KEY_ID=alias/gol-backups \
   bash deploy/remote-release.sh \"$PREVIOUS_COMMIT\""
```

The release script takes a backup before migrations. Never delete `postgres_data`, never
reset the database to erase journal records, and never invent a replacement transaction
after a worker restart. If a migration or restore is needed, use `backup-db.sh` and
`restore-db.sh` with the isolated `gol_restore_*` database prefix.

Contract deployments are immutable. If a new factory or signer mandate is wrong, stop
new payments, revoke the owner mandate, correct the deployment manifest/configuration,
and deploy a reviewed application/subgraph version. Do not pretend that an application
rollback undoes an on-chain transaction.

## 10. Common failures

| Symptom                                            | Action                                                                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Graph HTTP `429`                                   | Stop polling; check Studio quota/rate limit, use the current endpoint/API key, and retry after the provider window.                                           |
| Graph `status=unavailable`                         | Verify `GRAPH_QUERY_URL` and API key, then run the authenticated `_meta` query. Check that Studio indexing has caught up to the factory start block.          |
| `hasIndexingErrors=true`                           | Stop claiming the subgraph is live; inspect Studio indexing errors and fix manifest/mapping before changing production.                                       |
| `/app/api/health` has `sourceCommit=null`          | A stack was recreated outside `remote-release.sh`; rerun the standard release script for the exact commit.                                                    |
| `remote-release.sh` says dirty/mismatched checkout | Do not force it. Fetch the intended commit, remove only reviewed generated artifacts, and ensure the checkout exactly matches the release hash.               |
| Worker `SIGNER_BLOCKED` / gas insufficient         | Check the active owner mandate, KMS signer address, Arc native-gas reserve, and worker logs. Do not bypass contract policy.                                   |
| Fund/payment transaction reverted                  | Verify Arc chain ID, official Arc USDC address, account address, allowance/funds, and the exact contract error. Record the refusal; do not fabricate success. |
| Container unhealthy                                | Inspect `docker compose logs web worker`, check disk/memory and database health, then use the known-good commit rollback path.                                |
| API/deploy key appears in output                   | Revoke/regenerate it in Studio immediately, update local/host files, and rerun the authenticated query and release verification.                              |

## 11. Release evidence checklist

Before declaring a release complete, retain only non-secret evidence:

- release commit and GitHub CI/release run IDs;
- contract address, deployment block, transaction hash, and manifest source commit;
- Graph slug, version, query URL, `_meta` result, indexing block, and error status;
- S3 pre-deploy backup URI;
- public `/app/api/health` response and container health output;
- smoke-test transaction/refusal hashes and timestamps.

Do not record deploy keys, API keys, wallet material, database passwords, or credential-
bearing URLs in this evidence.
