import { LandingSection, SectionHeading } from './landing-primitives';
import { PartnerNetworkMap } from './partner-network-map';

export function ProductSections() {
  return (
    <LandingSection id="product" labelledBy="product-title">
      <SectionHeading
        id="product-title"
        eyebrow="The network layer"
        title="One account. A connected ecosystem."
        copy="Builders, markets and service rails connect around one owner-controlled authority layer."
      />
      <PartnerNetworkMap />
    </LandingSection>
  );
}
