import React, { useState } from "react";
import RevealSection, { Reveal } from "../components/RevealSection";
import RegisterModal from "../components/RegisterModal";
import expertsHeroImage from "../assets/images/IMG-20220502-WA0001.jpg";

const domainBlocks = [
  {
    title: "Technical & Engineering Systems",
    points: [
      "Infrastructure and utility systems",
      "Equipment engineering and operations",
      "Monitoring and control systems",
      "Diagnostics and maintenance practices",
    ],
  },
  {
    title: "Operations & System Management",
    points: [
      "System operations and coordination",
      "Monitoring platforms and decision-making tools",
      "Data-driven operational management",
    ],
  },
  {
    title: "Safety & Compliance",
    points: [
      "Regulatory compliance frameworks",
      "Workplace safety systems",
      "Hazard identification and risk mitigation",
      "Incident investigation and corrective actions",
    ],
  },
  {
    title: "Asset & Maintenance Management",
    points: [
      "Asset lifecycle management",
      "Preventive and condition-based maintenance",
      "Reliability-centered maintenance strategies",
    ],
  },
  {
    title: "Project & Contract Management",
    points: [
      "Project planning and execution",
      "Contract administration and dispute management",
      "Stakeholder coordination",
    ],
  },
  {
    title: "Regulatory, Financial & Leadership",
    points: [
      "Regulatory frameworks and compliance",
      "Financial management for technical professionals",
      "Leadership, team management, and organizational effectiveness",
    ],
  },
];

const WhoCanRegister = [
  "Engineers and technical professionals",
  "Industry practitioners with domain experience",
  "Subject matter experts across infrastructure, utilities, and industrial systems",
  "Professionals with exposure to operations, safety, compliance, or project execution",
];

export default function Experts() {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  function openRegister(expert = null) {
    setSelectedExpert(expert);
    setShowRegister(true);
  }

  return (
    <main className="experts-page-main">
      <section
        className="about-hero experts-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${expertsHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Industry Experts & Program Leaders</h1>
            <p>
              Voltgrid Insights invites experienced professionals and domain
              experts to participate in capability-building initiatives across
              technical, operational, safety, and management domains.
            </p>
            <br />
            <p>
              Experts associated with Voltgrid Insights contribute through
              training delivery, knowledge sharing, and field-oriented
              engagement.
            </p>
          </div>
        </div>
      </section>

      <div className="experts-page experts-page--reveal">
        <RevealSection
          className="experts-reveal-cta"
          ariaLabel="Join as an expert"
          eyebrow="Collaborate"
          title="Join as an Expert"
          description="Professionals with relevant industry experience can register to contribute through training delivery, knowledge sharing, and field-oriented engagement."
          compactHeader
        >
          <Reveal className="experts-cta card" delay="0.36s">
            <button
              type="button"
              className="btn btn-danger reg-button"
              onClick={() => openRegister()}
            >
              Register as Expert
            </button>
          </Reveal>
        </RevealSection>

        <RevealSection
          className="experts-reveal-who"
          ariaLabel="Who can register"
          eyebrow="Eligibility"
          title="Who Can Register"
          description="Open to practitioners and subject matter experts across technical, operational, and compliance-focused domains."
          compactHeader
        >
          <div className="safety-grid experts-who-grid">
            {WhoCanRegister.map((item, index) => (
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
          className="experts-reveal-domains"
          ariaLabel="Expertise domains"
          eyebrow="Domains"
          title="Areas of Expertise"
          description="Contribute across the program areas where your industry experience aligns with Voltgrid Insights capability-building initiatives."
          compactHeader
        >
          <div className="experts-domain-grid">
            {domainBlocks.map((block, index) => (
              <Reveal
                key={block.title}
                as="article"
                className="experts-domain-card card"
                delay={`${0.34 + index * 0.06}s`}
              >
                <h3>{block.title}</h3>
                <ul>
                  {block.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </RevealSection>
      </div>

      {showRegister && (
        <RegisterModal
          expert={selectedExpert}
          onClose={() => setShowRegister(false)}
        />
      )}
    </main>
  );
}
