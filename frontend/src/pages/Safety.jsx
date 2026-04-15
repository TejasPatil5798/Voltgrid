import React from "react";

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
  "Utilities",
  "Infrastructure Systems",
  "Industrial Operations",
  "Public Sector Organizations",
];

const impactIndicators = [
  "Number of programs delivered",
  "Participant coverage",
  "Sector diversity",
];

const impactAreas = [
  "Operational efficiency improvement",
  "Compliance adherence",
  "Risk reduction",
  "Skill and capability enhancement",
];

const programCategories = [
  "Technical & Engineering Systems",
  "Operations & Control Systems",
  "Safety & Compliance",
  "Asset & Maintenance Management",
  "Project & Contract Management",
  "Regulatory, Financial & Leadership Development",
];

const customizationPoints = [
  "Sector requirements",
  "Participant roles and experience levels",
  "Specific operational challenges",
];

const methodologyApproach = [
  "Modular and structured delivery",
  "Outcome-focused training design",
  "Sector-adaptable content",
];

const methodsUsed = [
  "Technical sessions",
  "Case studies",
  "Simulation-based learning (including VR/AR where applicable)",
  "Scenario-based exercises",
];

const residentialPoints = [
  "Continuous faculty interaction",
  "Extended learning sessions",
  "Group-based exercises and discussions",
  "Practical and scenario-based engagement",
];

export default function Safety() {
  return (
    <main>
      <section className="safety-hero safety-banner">
        <div className="safety-hero-overlay">
          <div className="safety-hero-content container">
            <span className="section-tag">Safety & Compliance</span>
            <h1>Safety & Compliance</h1>
            <p>
              Structured safety training programs designed to improve
              compliance, reduce operational risks, and strengthen
              institutional safety culture.
            </p>
          </div>
        </div>
      </section>

      <section className="safety-page">
        <div className="section-header safety-header">
          <span className="section-tag">Safety Coverage</span>
          <h2>Structured Safety Learning for Operational Environments</h2>
          <p>
            Safety learning is delivered through practical, compliance-focused,
            and field-relevant modules designed for institutional and industrial
            settings.
          </p>
        </div>

        <div className="safety-feature-card">
          <div className="safety-feature-media">
            <img
              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80"
              alt="Safety training and workplace compliance"
            />
          </div>
          <div className="safety-feature-copy">
            <span className="section-tag">Coverage</span>
            <h2>Coverage</h2>
            <ul className="safety-list">
              {safetyCoverage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              Programs are designed to support operational safety, regulatory
              adherence, and workplace risk control across multiple sectors.
            </p>
          </div>
        </div>

        <section className="safety-surface">
          <div className="section-header safety-subheader">
            <span className="section-tag">Training Approach</span>
            <h2>Training Approach</h2>
          </div>
          <div className="safety-grid">
            {safetyApproach.map((item) => (
              <div key={item} className="safety-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="safety-feature-card safety-feature-card-reverse">
          <div className="safety-feature-copy">
            <span className="section-tag">Outcome</span>
            <h2>Outcome</h2>
            <ul className="safety-list">
              {safetyOutcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              Training interventions are designed to improve decision-making,
              hazard response capability, and long-term compliance performance.
            </p>
          </div>
          <div className="safety-feature-media">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
              alt="Improved safety outcomes and organizational readiness"
            />
          </div>
        </div>

        <section className="safety-highlight-panel">
          <div className="section-header safety-subheader">
            <span className="section-tag safety-section-tag-light">
              Safety Integration in Operations
            </span>
            <h2>Safety Integration in Operations</h2>
            <p>
              Safety learning is integrated into operational workflows through
              procedure-based instruction, field-oriented examples, and
              practical compliance discussions aligned with sector practices.
            </p>
          </div>
          <div className="safety-highlight-grid">
            <div className="safety-highlight-box">Permit-to-work systems</div>
            <div className="safety-highlight-box">Lockout / Tagout awareness</div>
            <div className="safety-highlight-box">Emergency response readiness</div>
            <div className="safety-highlight-box">Operational hazard communication</div>
          </div>
        </section>

        <section className="safety-surface">
          <div className="section-header safety-subheader">
            <span className="section-tag">Industry Alignment</span>
            <h2>Industry Alignment</h2>
            <p>
              Programs are structured to remain relevant across sectors,
              operational environments, and regulatory expectations.
            </p>
          </div>

          <div className="safety-feature-card safety-feature-card-plain">
            <div className="safety-feature-media">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                alt="Industry alignment and compliance frameworks"
              />
            </div>
            <div className="safety-feature-copy">
              <span className="section-tag">Alignment Approach</span>
              <h2>Alignment Approach</h2>
              <ul className="safety-list">
                {alignmentPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Training design integrates practical sector requirements to
                ensure direct relevance to participant roles and systems.
              </p>
            </div>
          </div>

          <div className="safety-flex-grid">
            {flexibilityPoints.map((item) => (
              <div key={item} className="safety-flex-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="safety-surface">
          <div className="section-header safety-subheader">
            <span className="section-tag">Impact & Outcomes</span>
            <h2>Impact & Outcomes</h2>
            <p>
              Training effectiveness is assessed through measurable delivery
              indicators and operational impact areas.
            </p>
          </div>

          <div className="safety-impact-grid-wrap">
            <article className="safety-impact-card">
              <h3>Performance Indicators</h3>
              <ul className="safety-list">
                {impactIndicators.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Program delivery indicators reflect institutional reach, sector
                engagement, and training scale.
              </p>
            </article>

            <article className="safety-impact-card">
              <h3>Outcome Areas</h3>
              <div className="safety-impact-tiles">
                {impactAreas.map((item) => (
                  <div key={item} className="safety-impact-tile">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="safety-programs-section">
          <div className="section-header safety-header">
            <span className="section-tag">Training Programs</span>
            <h2>TRAINING PROGRAMS</h2>
            <p>
              The following program and methodology lines are included exactly
              as requested.
            </p>
          </div>

          <div className="safety-feature-card">
            <div className="safety-feature-media">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
                alt="Structured training program delivery"
              />
            </div>
            <div className="safety-feature-copy">
              <span className="section-tag">Program Structure</span>
              <h2>Program Structure</h2>
              <p>
                Programs are offered as modular training units, typically
                structured over 3-5 days.
              </p>
            </div>
          </div>

          <section className="safety-surface">
            <div className="section-header safety-subheader">
              <span className="section-tag">Program Categories</span>
              <h2>Program Categories</h2>
            </div>
            <div className="safety-program-category-grid">
              {programCategories.map((item) => (
                <div key={item} className="safety-program-category-card">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <div className="safety-feature-card safety-feature-card-reverse">
            <div className="safety-feature-copy">
              <span className="section-tag">Customized Programs</span>
              <h2>Customized Programs</h2>
              <p>Programs can be customized based on:</p>
              <ul className="safety-list">
                {customizationPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="safety-feature-media">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Customized program design"
              />
            </div>
          </div>

          <section className="safety-surface">
            <div className="section-header safety-subheader">
              <span className="section-tag">TRAINING METHODOLOGY</span>
              <h2>TRAINING METHODOLOGY</h2>
            </div>

            <div className="safety-method-grid">
              <article className="safety-method-card">
                <span className="section-tag">Approach</span>
                <h3>Approach</h3>
                <ul className="safety-list">
                  {methodologyApproach.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="safety-method-card">
                <span className="section-tag">Methods Used</span>
                <h3>Methods Used</h3>
                <ul className="safety-list">
                  {methodsUsed.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="safety-residential-panel">
              <div className="safety-residential-copy">
                <span className="section-tag safety-section-tag-light">
                  Residential Learning Model
                </span>
                <h3>Residential Learning Model</h3>
                <p>
                  Residential programs follow an immersive learning approach,
                  including:
                </p>
                <ul className="safety-list safety-list-light">
                  {residentialPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="safety-residential-note">
                  This format improves knowledge, retention, and application
                  capability, subject to facility and batch planning.
                </p>
              </div>
              <div className="safety-residential-media">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
                  alt="Residential learning model"
                />
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
