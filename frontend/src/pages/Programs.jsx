import React from "react";

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

const approachPoints = [
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

export default function Programs() {
  return (
    <main>
      <section className="programs-hero hero">
        <div className="hero-content container">
          <h1>Training Programs</h1>
          <p className="lead">
            Structured learning programs across technical, operational, safety,
            maintenance, project, and leadership domains for measurable
            capability development.
          </p>
          <div className="hero-actions">
            <a href="/contact" className="btn btn-primary">
              Enquire Now
            </a>
            <a href="#training-programs" className="btn">
              Explore Programs
            </a>
          </div>
        </div>
      </section>

      <section id="training-programs" className="programs-page">
        <div className="section-header programs-header">
          <span className="section-tag">Training Programs</span>
          <h2>TRAINING PROGRAMS</h2>
          <p>
            Programs are delivered through a modular and structured framework
            that supports practical learning, customization, and operational
            relevance.
          </p>
        </div>

        <div className="programs-feature-card">
          <div className="programs-feature-media">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
              alt="Training program planning and structured delivery"
            />
          </div>
          <div className="programs-feature-copy">
            <span className="section-tag">Program Structure</span>
            <h2>Program Structure</h2>
            <p>
              Programs are offered as modular training units, typically
              structured over 3-5 days.
            </p>
          </div>
        </div>

        <section className="programs-surface">
          <div className="section-header programs-subheader">
            <span className="section-tag">Program Categories</span>
            <h2>Program Categories</h2>
          </div>
          <div className="program-categories-grid">
            {programCategories.map((category) => (
              <div key={category} className="program-category-card">
                {category}
              </div>
            ))}
          </div>
        </section>

        <section className="programs-feature-card programs-feature-card-reverse">
          <div className="programs-feature-copy">
            <span className="section-tag">Customized Programs</span>
            <h2>Customized Programs</h2>
            <p>Programs can be customized based on:</p>
            <ul className="programs-list">
              {customizationPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="programs-feature-media">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Customized training programs and participant engagement"
            />
          </div>
        </section>

        <section className="programs-methodology-section">
          <div className="section-header programs-header">
            <span className="section-tag">Training Methodology</span>
            <h2>TRAINING METHODOLOGY</h2>
          </div>

          <div className="programs-methodology-grid">
            <article className="programs-method-card">
              <span className="section-tag">Approach</span>
              <h3>Approach</h3>
              <ul className="programs-list">
                {approachPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>

            <article className="programs-method-card">
              <span className="section-tag">Methods Used</span>
              <h3>Methods Used</h3>
              <ul className="programs-list">
                {methodsUsed.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="programs-residential-panel">
            <div className="programs-residential-copy">
              <span className="section-tag programs-section-tag-light">
                Residential Learning Model
              </span>
              <h3>Residential Learning Model</h3>
              <p>
                Residential programs follow an immersive learning approach,
                including:
              </p>
              <ul className="programs-list programs-list-light">
                {residentialPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="programs-residential-note">
                This format improves knowledge, retention, and application
                capability, subject to facility and batch planning.
              </p>
            </div>
            <div className="programs-residential-media">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
                alt="Residential learning and immersive group engagement"
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
