import React from "react";
import aboutHeroImage from "../assets/images/abt_hero.jpg";
import overviewImage from "../assets/images/imp.jpg";
import visionImage from "../assets/images/vision.JPG";
import missionImage from "../assets/images/mission.jpg";
import impactImage from "../assets/images/Impact.jpg";

export default function About() {
  const initiatives = [
    {
      title: "Substation Engagement Programs",
      description:
        "Structured sessions conducted at substations to strengthen operational discipline, field awareness, and system-level understanding.",
      points: [
        "Operational practices and system understanding",
        "Safety procedures and risk identification",
        "Handling of real-world field challenges",
      ],
    },
    {
      title: "Community Awareness Drives",
      description:
        "Programs conducted at village and community levels focusing on safe interaction with electrical infrastructure and awareness of power systems.",
      points: [
        "Safe interaction with electrical infrastructure",
        "Awareness of power systems",
        "Reduction of accidental risks",
      ],
    },
    {
      title: "Safety & Compliance Campaigns",
      description:
        "Focused initiatives promoting practical safety behavior and stronger procedural discipline across operational environments.",
      points: [
        "Safe working practices",
        "Hazard identification and reporting",
        "Procedural compliance",
      ],
    },
    {
      title: "Practical Learning Interventions",
      description:
        "Targeted sessions for engineers, technicians, and field personnel built around applied learning and better decision-making.",
      points: [
        "Application-based understanding",
        "Case-based learning",
        "Situational awareness and decision-making",
      ],
    },
  ];

  const impactPoints = [
    "Strengthened operational awareness",
    "Improved adherence to safety practices",
    "Enhanced field-level decision-making",
    "Increased awareness of infrastructure interaction",
  ];

  return (
    <main>
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${aboutHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>About Us</h1>
            <p>
              Delivering structured capacity-building programs across technical,
              operational, safety, and leadership domains for institutional
              excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="about-page">
        <div className="about-row about-feature-card">
          <div className="about-image about-media">
            <img
              src={overviewImage}
              alt="Professional training and planning discussion"
            />
          </div>
          <div className="about-text">
            <h2 className="head-sec">Overview</h2>
            <p>
              Voltgrid Insights focuses on capability-building and
              knowledge-driven programs across technical, operational, and
              managerial domains.
            </p>
            <p>The approach is centered on:</p>
            <ul className="about-check-list">
              <li>Practical applicability</li>
              <li>Operational relevance</li>
              <li>Measurable outcomes</li>
            </ul>
          </div>
        </div>

        <div className="vision-mission-grid">
          <div className="info-card">
            <img src={visionImage} alt="Collaborative workforce vision" />
            <h2 className="head-sec">Vision</h2>
            <p>
              To develop a{" "}
              <strong>
                competent, compliant, and performance-oriented workforce
              </strong>{" "}
              across sectors.
            </p>
          </div>

          <div className="info-card">
            <img src={missionImage} alt="Mission-led professional development" />
            <h2 className="head-sec">Mission</h2>
            <ul className="about-check-list">
              <li>Deliver structured and measurable programs</li>
              <li>Improve operational efficiency and system performance</li>
              <li>Enable compliance with applicable regulations</li>
              <li>Strengthen leadership and organisational capability</li>
            </ul>
          </div>
        </div>

        <div className="capabilities-section about-surface">
          <div className="section-header about-subheader">
            <h2>
              Multi-Domain Capability for Technical and Operational Excellence
            </h2>
          </div>
          <div className="capability-grid">
            <div className="capability-card">
              Technical training across infrastructure systems
            </div>
            <div className="capability-card">
              Safety and compliance training
            </div>
            <div className="capability-card">
              Operations and system management training
            </div>
            <div className="capability-card">
              Asset and maintenance management
            </div>
            <div className="capability-card">
              Project and contract management
            </div>
            <div className="capability-card">
              Leadership and organizational development
            </div>
          </div>
        </div>

        <div className="training-formats">
          <div className="section-header">
            <h2 className="head-sec">Sector Coverage</h2>
          </div>
          <div className="formats-grid sector-coverage-grid">
            <div className="format-card">
              <div className="format-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Power and Energy</h3>
            </div>
            <div className="format-card">
              <div className="format-icon">
                <i className="fas fa-city"></i>
              </div>
              <h3>Infrastructure and Utilities</h3>
            </div>
            <div className="format-card">
              <div className="format-icon">
                <i className="fas fa-industry"></i>
              </div>
              <h3>Manufacturing and Industrial Systems</h3>
            </div>
            <div className="format-card">
              <div className="format-icon">
                <i className="fas fa-landmark"></i>
              </div>
              <h3>Government and Public Administration</h3>
            </div>
          </div>
        </div>

        <div className="why-section about-surface">
          <div className="section-header about-subheader">
            <h2>Who We Work With</h2>
          </div>
          <div className="why-grid">
            <div className="capability-card">
              <strong>Government Departments</strong>
            </div>
            <div className="capability-card">
              <strong>Public Sector Undertakings (PSUs)</strong>
            </div>
            <div className="capability-card">
              <strong>Infrastructure and Utility Organizations</strong>
            </div>
            <div className="capability-card">
              <strong>Industrial and Manufacturing Enterprises</strong>
            </div>
          </div>
        </div>

        <div className="about-feature-card about-compliance-card">
          <div className="about-text">
            <h2 className="head-sec text-center">Compliance Alignment</h2>
            <p className="text-center">
              <strong>
                All programs are designed and delivered in alignment with
                applicable regulatory requirements, institutional procedures,
                and relevant industry standards, ensuring audit readiness and
                compliance with governing frameworks.
              </strong>
            </p>
          </div>
        </div>

        <div className="why-section about-surface">
          <div className="section-header about-subheader">
            <h2>Why Choose Voltgrid Insights</h2>
          </div>
          <div className="why-grid why-choose-grid">
            <div className="capability-card text-center">
              Structured and competency-based approach
            </div>
            <div className="capability-card text-center">
              Programs aligned with operational requirements and industry
              practices
            </div>
            <div className="capability-card text-center">
              Multi-domain capability across technical, operational, and
              management areas
            </div>
            <div className="capability-card text-center">
              Flexible delivery formats including residential programs
            </div>
            <div className="capability-card text-center">
              Focus on practical application and measurable outcomes
            </div>
          </div>
        </div>

        <section className="about-impact-hero">
          <div className="about-impact-overlay">
            <div className="about-impact-content">
              <h1>Impact</h1>
              <p>Driving Knowledge. Strengthening Systems.</p>
            </div>
          </div>
        </section>

        <section className="field-initiatives-section">
          <div className="field-initiatives-intro">
            <div className="field-initiatives-copy">
              <h2 className="head-sec">
                Driving Knowledge. Strengthening Systems.
              </h2>
              <p>
                Voltgrid Insights has undertaken multiple on-ground initiatives
                focused on strengthening technical awareness, safety practices,
                and system-level understanding across operational environments
                and community interfaces.
              </p>
              <p>
                These initiatives extend beyond structured programs into real
                working conditions and field environments, supporting practical
                knowledge dissemination and awareness.
              </p>
            </div>
            <div className="field-initiatives-image">
              <img
                src={impactImage}
                alt="Field engagement around power infrastructure"
              />
            </div>
          </div>

          <h2 className="head-sec mt-4">Our Initiatives</h2>

          <div className="field-initiatives-grid">
            {initiatives.map((initiative) => (
              <article key={initiative.title} className="field-card">
                <h3>{initiative.title}</h3>
                <p>{initiative.description}</p>
                <ul>
                  {initiative.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="field-impact-panel">
            <div className="field-impact-heading">
              <h3 className="text-center">Impact</h3>
            </div>
            <div className="field-impact-grid">
              {impactPoints.map((point) => (
                <div key={point} className="field-impact-item">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
