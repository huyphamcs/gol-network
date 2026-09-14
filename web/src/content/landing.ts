export const landingCopy = {
  eyebrow: 'The account built for autonomous money',
  headline: 'One account. Every market.',
  lead: 'Your limits. Every refusal recorded.',
  description:
    'Trade, route, rebalance and pay across on-chain and off-chain markets through one non-custodial account. The owner sets the authority. The agent can only ask.',
  status:
    'Prototype status: nothing has shipped under the name Gol. This repository demonstrates a limited account and payment path while the broader product remains the design target.',
  boundary:
    'Turn every Morca server off. Then try to exceed the limit. The account still refuses the request.',
  outcome: 'You do not approve opaque transactions. You approve an understandable outcome.',
  closer: 'Set the limit. Send the agent. Keep the proof.',
} as const;

export const landingNavItems = [
  { href: '#product', label: 'Product' },
  { href: '#boundary', label: 'Boundary' },
  { href: '#markets', label: 'Markets' },
  { href: '#roadmap', label: 'Roadmap' },
] as const;

export const accountStats = [
  { value: '01', label: 'Account across every market' },
  { value: '02', label: 'Separate owner and agent lanes' },
  { value: '03', label: 'Receipts that compound with use' },
] as const;

export const heroStats = [
  { value: '01', label: 'Bounded account' },
  { value: '02', label: 'Authority system' },
  { value: '03', label: 'Execution planner' },
  { value: '04', label: 'Verifiable proof' },
] as const;

export const networkPillars = [
  {
    title: 'Owners and builders',
    detail: 'A human-owned account with a scoped lane for agent workflows.',
    points: ['Direct owner control', 'Revocable agent access', 'Open product surfaces'],
    action: 'Explore the account',
    href: '/app',
  },
  {
    title: 'Market adapters',
    detail: 'Venues stay at the edge while Gol keeps one authority boundary.',
    points: ['Chain-neutral routing', 'Defined integration slots', 'No venue custody'],
    action: 'Review the markets',
    href: '#markets',
  },
  {
    title: 'Policy and proof',
    detail: 'The binding check and the decision record stay close to value.',
    points: ['On-chain enforcement', 'Refusal records', 'Outcome verification'],
    action: 'Read the boundary',
    href: '#boundary',
  },
  {
    title: 'Payment and service rails',
    detail: 'Regulated and open services connect through explicit adapters.',
    points: ['Programmable payments', 'Scoped providers', 'Unified account state'],
    action: 'See the system map',
    href: '#roadmap',
  },
] as const;

export const builderSteps = [
  { title: 'Set up the account', detail: 'Create an owner-controlled account and agent lane.' },
  { title: 'Create the mandate', detail: 'Define permissions, limits, assets and time windows.' },
  { title: 'Build and test', detail: 'Use the current tools to exercise the bounded path.' },
  { title: 'Connect a market', detail: 'Add an adapter without moving the authority boundary.' },
] as const;

export const platformFeatures = [
  {
    title: 'Policy-native',
    detail: 'The account enforces what an agent may do where value moves.',
    image: '/gol-policy-layers.png',
  },
  {
    title: 'Chain-neutral',
    detail: 'A common authority model can sit below many networks and venues.',
    image: '/gol-network-modules.png',
  },
  {
    title: 'Execution-aware',
    detail: 'Plan, simulate, authorize, recover and verify as one sequence.',
    image: '/gol-execution-panels.png',
  },
] as const;

export const completeStack = [
  { title: 'Agent accounts', detail: 'Owner control with granular permissions and limits.' },
  { title: 'Policy engine', detail: 'Enforceable rules and fail-closed agent checks.' },
  { title: 'Refusal records', detail: 'A record of blocked actions and remaining headroom.' },
  { title: 'Execution logs', detail: 'Visibility into intent, route and system events.' },
  { title: 'Market router', detail: 'One adapter model for many venues and rails.' },
  { title: 'Unified state', detail: 'One view of balances, policies and activity.' },
] as const;

export const authorityRoles = [
  {
    eyebrow: 'For owners',
    title: 'You remain in control.',
    detail:
      'Set amount, recipient, asset, venue, chain and time limits. Keep direct control and the ability to withdraw without Gol.',
  },
  {
    eyebrow: 'For agents',
    title: 'Authority is borrowed, never owned.',
    detail:
      'Any agent can use a scoped, short-lived and revocable lane. If a required check fails, nothing moves.',
  },
  {
    eyebrow: 'For venues',
    title: 'Markets stay at the edge.',
    detail:
      'Every venue connects through an adapter after the mandate check. Gol routes to markets and never becomes one.',
  },
] as const;

export const enforcementLayers = [
  {
    index: '01',
    title: 'Prompt',
    detail: 'A prompt can be rewritten. It can guide an agent, but it cannot bind the money.',
    state: 'advisory',
  },
  {
    index: '02',
    title: 'Framework',
    detail: 'A framework can be replaced. Its rules disappear when the agent moves elsewhere.',
    state: 'advisory',
  },
  {
    index: '03',
    title: 'Server',
    detail: 'A server can be compromised. Whoever controls it can rewrite a server-side limit.',
    state: 'advisory',
  },
  {
    index: '04',
    title: 'Account policy',
    detail: 'The binding check sits where value moves. Even our servers cannot quietly raise it.',
    state: 'binding',
  },
] as const;

export const receiptTypes = [
  {
    index: '01',
    title: 'Refused',
    detail: 'What the agent attempted, which rule stopped it and how much headroom remained.',
    sample: '101 USDC blocked by a 100 USDC cap',
  },
  {
    index: '02',
    title: 'Promised',
    detail: 'Expected output, fees, slippage, risk and permissions before execution begins.',
    sample: '99.42 received, 0.31 fee expected',
  },
  {
    index: '03',
    title: 'Actual',
    detail: 'The real route, output, fees, slippage and any unfinished exposure after execution.',
    sample: '99.38 received, two legs completed',
  },
] as const;

export const marketCategories = [
  { title: 'Swaps', detail: 'Route orders across liquidity without owning the book.' },
  { title: 'Perpetuals', detail: 'Bound leverage, position size and liquidation risk.' },
  { title: 'Yield', detail: 'Select and monitor non-custodial strategies.' },
  { title: 'Prediction', detail: 'Compare markets through one bounded intent.' },
  { title: 'Payments', detail: 'Let agents pay people, services and other agents.' },
  { title: 'Tokenized assets', detail: 'Apply account policy before a routed order.' },
  { title: 'Banking rails', detail: 'Connect regulated services through a defined slot.' },
  {
    title: 'Parametric cover',
    detail: 'Prove triggers while leaving underwriting to providers.',
  },
] as const;

export const executionSteps = [
  'Understand intent',
  'Read constraints',
  'Plan every leg',
  'Check the mandate',
  'Simulate',
  'Authorize',
  'Execute',
  'Recover',
  'Verify outcome',
  'Learn',
] as const;

export const systemLayers = [
  { level: '07', title: 'Surfaces', detail: 'App, terminal, mobile, MCP, CLI and SDK' },
  { level: '06', title: 'Growth', detail: 'Quests, campaigns, rewards and referrals' },
  { level: '05', title: 'Markets', detail: 'Trade, yield, prediction, payments and assets' },
  {
    level: '04',
    title: 'Execution brain',
    detail: 'Plan, simulate, authorize, execute, recover and verify',
  },
  { level: '03', title: 'Agent', detail: 'Reasoning, rules, checks and triggers' },
  { level: '02', title: 'Proof', detail: 'Refusals, outcomes and decision records' },
  { level: '01', title: 'Authority and state', detail: 'Account, mandates and enforcement' },
] as const;

export const versionLadder = [
  {
    version: 'v0',
    title: 'The account',
    detail: 'Owner lane, agent lane, mandates and refusal records.',
  },
  {
    version: 'v1',
    title: 'The trading agent',
    detail: 'Router, terminal, strategy set and visible risk assessment.',
  },
  {
    version: 'v2',
    title: 'Proof and venue mesh',
    detail: 'v2 to v3 adds verifiable decisions, attestations and venue aggregation.',
  },
  {
    version: 'v4',
    title: 'Growth to agent economy',
    detail: 'v4 to v6 adds growth, licensed service rails and cross-system strategies.',
  },
] as const;

export const currentEvidence = [
  'A limited testnet account and mandate-oriented payment flow in this repository.',
  'Separate owner actions and a scoped agent signing path.',
  'An authoritative account check for the implemented payment rules.',
  'Existing authority, trading, rules, growth and proof components awaiting integration.',
] as const;

export const currentGaps = [
  'Nothing is integrated into the complete Gol product yet.',
  'The multi-market and multi-chain account is a design target.',
  'Full promised-versus-actual receipts and recovery are not established.',
  'Production readiness and an independent security audit are not established.',
] as const;

export const substrateComponents = [
  'Authority core',
  'Trading core',
  'Rules brain',
  'Growth engine',
  'Proof tooling',
] as const;

export const landingResources = [
  { title: 'Docs', detail: 'Guides, APIs and references', href: '/tools' },
  { title: 'Prototype', detail: 'Test the bounded payment path', href: '/app' },
  { title: 'Mandates', detail: 'Understand the authority model', href: '#boundary' },
  { title: 'Markets', detail: 'Explore the adapter surface', href: '#markets' },
] as const;

export const insightCards = [
  {
    category: 'Research',
    title: 'Why refusal records matter for autonomous finance',
    detail:
      'A refusal history shows what an agent could not do, making limits inspectable after the decision.',
    image: '/gol-insight-refusals.png',
  },
  {
    category: 'Technical',
    title: 'Outcome verification for real-world agent execution',
    detail:
      'Compare the intended result with the actual route, output, fees and unfinished exposure.',
    image: '/gol-insight-outcomes.png',
  },
  {
    category: 'Architecture',
    title: 'Building an open network for agent-native markets',
    detail:
      'A common authority layer lets accounts, agents and venues connect without sharing custody.',
    image: '/gol-insight-network.png',
  },
] as const;
