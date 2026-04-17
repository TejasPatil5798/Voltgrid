import React from "react";
import programsHeroImage from "../assets/images/IMG-20220502-WA0001.jpg";
import trainingImage from "../assets/images/training.jpg";
import towersImage from "../assets/images/towers.jpg";
import residentialImage from "../assets/images/pexels-pavel-danilyuk-8761523.jpg";

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
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${programsHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Training Programs</h1>
            <p>
              Structured learning programs across technical, operational,
              safety, maintenance, project, and leadership domains for
              measurable capability development.
            </p>
          </div>
        </div>
      </section>

      <section id="training-programs" className="programs-page">
        <div className="section-header programs-header">
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
              src={trainingImage}
              alt="Training program planning and structured delivery"
              loading="lazy"
            />
          </div>
          <div className="programs-feature-copy">
            <h2 className="head-sec">Program Structure</h2>
            <p>
              Programs are offered as modular training units, typically
              structured over 3–5 days.
            </p>
          </div>
        </div>

        <section className="programs-surface">
          <div className="section-header programs-subheader">
            <h2>Program Categories</h2>
          </div>
          <div className="program-categories-grid">
            {programCategories.map((category, index) => (
              <div key={index} className="program-category-card">
                {category}
              </div>
            ))}
          </div>
        </section>

        <section className="programs-feature-card programs-feature-card-reverse">
          <div className="programs-feature-copy">
            <h2 className="head-sec">Customized Programs</h2>
            <p>Programs can be customized based on:</p>
            <ul className="programs-list">
              {customizationPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="programs-feature-media">
            <img
              src={towersImage}
              alt="Customized training programs and participant engagement"
              loading="lazy"
            />
          </div>
        </section>

        <section className="programs-methodology-section">
          <div className="section-header programs-header">
            <h2>TRAINING METHODOLOGY</h2>
          </div>

          <div className="programs-methodology-grid">
            <article className="programs-method-card">
              <h3 className="head-sec">Approach</h3>
              <ul className="programs-list">
                {approachPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </article>

            <article className="programs-method-card">
              <h3 className="head-sec">Methods Used</h3>
              <ul className="programs-list">
                {methodsUsed.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="programs-residential-panel">
            <div className="programs-residential-copy">
              <h3>Residential Learning Model</h3>
              <p>
                Residential programs follow an immersive learning approach,
                including:
              </p>
              <ul className="programs-list programs-list-light">
                {residentialPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p className="programs-residential-note">
                This format improves knowledge retention and application
                capability, subject to facility and batch planning.
              </p>
            </div>
            <div className="programs-residential-media">
              <img
                src={residentialImage}
                alt="Residential learning and immersive group engagement"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}