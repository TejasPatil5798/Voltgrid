import React from "react";
import safetyHeroImage from "../assets/images/safety-hero.png";
import safetyCoverageImage from "../assets/images/gettyimages-1166085429-612x612.jpg";
import safetyOutcomeImage from "../assets/images/gettyimages-1179434300-612x612.jpg";
import safetyAlignmentImage from "../assets/images/gettyimages-1301243910-612x612.jpg";
import safetyProgramImage from "../assets/images/gettyimages-661805558-612x612.jpg";
import safetyCustomImage from "../assets/images/towers.jpg";
import safetyResidentialImage from "../assets/images/IMG_20220425_101407.jpg.jpeg";

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

      <section className="safety-page">
        <div className="safety-feature-card">
          <div className="safety-feature-media">
            <img
              src={safetyCoverageImage}
              alt="Safety training and workplace compliance"
            />
          </div>
          <div className="safety-feature-copy">
            <h2 className="head-sec">Coverage</h2>
            <ul className="safety-list">
              {safetyCoverage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="safety-surface">
          <div className="section-header safety-subheader">
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
            <h2 className="head-sec">Outcome</h2>
            <ul className="safety-list">
              {safetyOutcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="safety-feature-media">
            <img
              src={safetyOutcomeImage}
              alt="Improved safety outcomes and organizational readiness"
            />
          </div>
        </div>

        <section className="safety-surface">
          <div className="section-header safety-subheader">
            <h2>Industry Alignment</h2>
          </div>

          <div className="safety-feature-card safety-feature-card-plain">
            <div className="safety-feature-media">
              <img
                src={safetyAlignmentImage}
                alt="Industry alignment and compliance frameworks"
              />
            </div>
            <div className="safety-feature-copy">
              <h2 className="head-sec">Approach</h2>
              <p>Programs are aligned with:</p>
              <ul className="safety-list">
                {alignmentPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="safety-flex-grid mt-4">
            {flexibilityPoints.map((item) => (
              <div key={item.label} className="safety-flex-card">
                <div className="safety-flex-icon">
                  <i className={item.icon}></i>
                </div>
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
}
