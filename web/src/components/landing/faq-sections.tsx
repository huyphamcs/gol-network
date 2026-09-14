import { FaqAccordion } from '@/components/ui/faq-accordion';
import { LandingSection } from './landing-primitives';

const questions = [
  {
    question: 'What is Gol?',
    answer:
      'Gol is a design target for one owner-controlled account where agents can act across markets inside explicit limits, with every refusal and outcome recorded.',
  },
  {
    question: 'Who controls the account?',
    answer:
      'The owner controls the account, mandate and signing boundary. An agent receives a scoped, revocable lane and cannot raise its own permissions.',
  },
  {
    question: 'What happens when a limit fails?',
    answer:
      'The request is refused before value moves. The refusal, rule and remaining headroom stay visible as part of the decision record.',
  },
  {
    question: 'Can markets change the policy?',
    answer:
      'No. Venues connect through adapters at the edge. The authority check stays with the account, before any market or payment rail executes.',
  },
  {
    question: 'Is the full network live?',
    answer:
      'No. This local prototype demonstrates a limited account and payment path. The broader multi-market network remains the product design target.',
  },
  {
    question: 'What can I try today?',
    answer:
      'Open the prototype to create a bounded request, inspect the owner and agent lanes, and see the refusal path when an action exceeds its mandate.',
  },
] as const;

const asciiCharacters = '01<>/{}[]+=*#@';
const asciiWall = Array.from({ length: 34 }, (_, row) => {
  let state = (row + 1) * 2_654_435_761;
  return Array.from({ length: 220 }, () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return asciiCharacters[state % asciiCharacters.length];
  }).join('');
});

export function FaqSections() {
  return (
    <LandingSection
      id="faq"
      labelledBy="faq-title"
      className="relative isolate overflow-hidden border-border bg-card px-5 py-20 text-foreground sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-[10px] leading-6 tracking-[0.22em] text-primary/[0.075]"
      >
        {asciiWall.map((line, row) => (
          <p key={row} className="whitespace-nowrap">
            {line}
          </p>
        ))}
      </div>

      <div className="relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <h2
            id="faq-title"
            className="max-w-md text-5xl leading-none font-medium tracking-tighter sm:text-6xl"
          >
            Before you
            <br />
            build.
          </h2>
          <p className="mt-7 max-w-sm leading-copy text-muted-foreground">
            The important boundaries are visible before an agent gets a chance to cross them.
          </p>
        </div>

        <FaqAccordion items={questions} />
      </div>
    </LandingSection>
  );
}
