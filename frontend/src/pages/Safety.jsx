import React from "react";
import RevealSection, { Reveal } from "../components/RevealSection";
import safetyHeroImage from "../assets/images/safety-hero.png";
import safetyCoverageImage from "../assets/images/gettyimages-1166085429-612x612.jpg";
import safetyOutcomeImage from "../assets/images/gettyimages-1179434300-612x612.jpg";
import safetyAlignmentImage from "../assets/images/gettyimages-1301243910-612x612.jpg";

const safetyCoverage = [
  "Workplace safety systems",
  "Hazard identification and risk mitigation",
  "Permit systems and procedural compliance",
  "Incident investigation and corrective actions",
];

const safetyApproach = [
  "Scenario-based learning",
  "Case studies and incident analysis",
  "Preventive safety practices",
  "Corrective safety response systems",
];

const safetyOutcomes = [
  "Improved compliance with safety standards",
  "Reduction in operational risks",
  "Strengthened safety culture",
];

const alignmentPoints = [
  "Sector-specific regulatory frameworks",
  "Industry standards and practices",
  "Organizational operational requirements",
];

const flexibilityPoints = [
  { label: "Utilities", icon: "fas fa-bolt" },
  { label: "Infrastructure Systems", icon: "fas fa-city" },
  { label: "Industrial Operations", icon: "fas fa-industry" },
  { label: "Public Sector Organizations", icon: "fas fa-landmark" },
];

export default function Safety() {
  return (
    <main className="safety-page-main">
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${safetyHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Safety & Compliance</h1>
            <p>
              All programs are designed and delivered in alignment with
              applicable safety regulations, organisational procedures, and
              industry standards, ensuring compliance, risk mitigation, and
              audit readiness.
            </p>
          </div>
        </div>
      </section>

      <div className="safety-page safety-page--reveal">
        <RevealSection
          className="safety-reveal-coverage"
          ariaLabel="Safety coverage"
          eyebrow="Scope"
          title="Coverage"
          description="Comprehensive safety and compliance training across workplace systems, hazards, permits, and incident response."
          compactHeader
        >
          <div className="safety-feature-card">
            <Reveal className="safety-feature-media reveal-item--from-left" delay="0.36s">
              <img
                src={safetyCoverageImage}
                alt="Safety training and workplace compliance"
                loading="lazy"
              />
            </Reveal>
            <div className="safety-feature-copy">
              <ul className="safety-list">
                {safetyCoverage.map((item, index) => (
                  <Reveal as="li" key={item} delay={`${0.42 + index * 0.06}s`}>
                    {item}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </RevealSection>

        <RevealSection
          className="safety-reveal-approach"
          ariaLabel="Training approach"
          eyebrow="Method"
          title="Training Approach"
          compactHeader
        >
          <div className="safety-grid">
            {safetyApproach.map((item, index) => (
              <Reveal
                key={item}
                as="div"
                className="safety-card"
                delay={`${0.34 + index * 0.08}s`}
              >
                {item}
              </Reveal>
            ))}
          </div>
        </RevealSection>

        <RevealSection
          className="safety-reveal-outcome"
          ariaLabel="Safety outcomes"
          eyebrow="Results"
          title="Outcome"
          description="Measurable improvements in compliance, risk reduction, and safety culture."
          compactHeader
        >
          <div className="safety-feature-card safety-feature-card-reverse">
            <div className="safety-feature-copy">
              <ul className="safety-list">
                {safetyOutcomes.map((item, index) => (
                  <Reveal as="li" key={item} delay={`${0.36 + index * 0.08}s`}>
                    {item}
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal className="safety-feature-media reveal-item--from-left" delay="0.4s">
              <img
                src={safetyOutcomeImage}
                alt="Improved safety outcomes and organizational readiness"
                loading="lazy"
              />
            </Reveal>
          </div>
        </RevealSection>

        <RevealSection
          className="safety-reveal-alignment"
          ariaLabel="Industry alignment"
          eyebrow="Standards"
          title="Industry Alignment"
          description="Programs aligned with regulatory frameworks, industry practice, and your operational context."
          compactHeader
        >
          <div className="safety-feature-card safety-feature-card-plain">
            <Reveal className="safety-feature-media reveal-item--from-left" delay="0.36s">
              <img
                src={safetyAlignmentImage}
                alt="Industry alignment and compliance frameworks"
                loading="lazy"
              />
            </Reveal>
            <div className="safety-feature-copy">
              <Reveal as="p" delay="0.42s">
                Programs are aligned with:
              </Reveal>
              <Reveal as="ul" className="safety-list" delay="0.48s">
                {alignmentPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Reveal>
            </div>
          </div>

          <div className="safety-flex-grid">
            {flexibilityPoints.map((item, index) => (
              <Reveal
                key={item.label}
                as="div"
                className="safety-flex-card"
                delay={`${0.56 + index * 0.08}s`}
              >
                <div className="safety-flex-icon">
                  <i className={item.icon} aria-hidden="true"></i>
                </div>
                <div>{item.label}</div>
              </Reveal>
            ))}
          </div>
        </RevealSection>
      </div>
    </main>
  );
}
