import React from "react";
import AboutArVrSection from "../components/AboutArVrSection";
import RevealSection, { Reveal } from "../components/RevealSection";
import aboutHeroImage from "../assets/images/abt_hero.jpg";
import overviewImage from "../assets/images/imp.jpg";
import visionImage from "../assets/images/vision1.JPG";
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

  const capabilities = [
    "Technical training across infrastructure systems",
    "Safety and compliance training",
    "Operations and system management training",
    "Asset and maintenance management",
    "Project and contract management",
    "Leadership and organizational development",
  ];

  const sectors = [
    { icon: "fa-bolt", title: "Power and Energy" },
    { icon: "fa-city", title: "Infrastructure and Utilities" },
    { icon: "fa-industry", title: "Manufacturing and Industrial Systems" },
    { icon: "fa-landmark", title: "Government and Public Administration" },
  ];

  const partners = [
    "Government Departments",
    "Public Sector Undertakings (PSUs)",
    "Infrastructure and Utility Organizations",
    "Industrial and Manufacturing Enterprises",
  ];

  const whyChoose = [
    "Structured and competency-based approach",
    "Programs aligned with operational requirements and industry practices",
    "Multi-domain capability across technical, operational, and management areas",
    "Flexible delivery formats including residential programs",
    "Focus on practical application and measurable outcomes",
  ];

  const impactPoints = [
    "Strengthened operational awareness",
    "Improved adherence to safety practices",
    "Enhanced field-level decision-making",
    "Increased awareness of infrastructure interaction",
  ];

  return (
    <main className="about-page-main">
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

      <div className="about-page about-page--reveal">
        <RevealSection
          className="about-reveal-overview"
          ariaLabel="Overview"
          eyebrow="Who we are"
          title="Overview"
          description="Capability-building and knowledge-driven programs across technical, operational, and managerial domains."
          compactHeader
        >
          <div className="about-row">
            <Reveal className="about-image about-media reveal-item--from-left" delay="0.36s">
              <img
                src={overviewImage}
                alt="Professional training and planning discussion"
              />
            </Reveal>
            <div className="about-text">
              <Reveal as="p" delay="0.44s">
                Voltgrid Insights focuses on capability-building and
                knowledge-driven programs across technical, operational, and
                managerial domains.
              </Reveal>
              <Reveal as="p" delay="0.5s">
                The approach is centered on:
              </Reveal>
              <Reveal as="ul" className="about-check-list" delay="0.56s">
                <li>Practical applicability</li>
                <li>Operational relevance</li>
                <li>Measurable outcomes</li>
              </Reveal>
            </div>
          </div>
        </RevealSection>

        <RevealSection
          className="about-reveal-vision"
          ariaLabel="Vision and mission"
          eyebrow="Our direction"
          title="Vision & Mission"
          compactHeader
        >
          <div className="vision-mission-grid">
            <Reveal as="div" className="info-card" delay="0.36s">
              <img src={visionImage} alt="Collaborative workforce vision" />
              <h3 className="head-sec text-center">Vision</h3>
              <p className="text-center">
                To develop a{" "}
                <strong>
                  competent, compliant, and performance-oriented workforce
                </strong>{" "}
                across sectors.
              </p>
            </Reveal>
            <Reveal as="div" className="info-card" delay="0.48s">
              <img src={missionImage} alt="Mission-led professional development" />
              <h3 className="head-sec text-center">Mission</h3>
              <ul className="about-check-list">
                <li>Deliver structured and measurable programs</li>
                <li>Improve operational efficiency and system performance</li>
                <li>Enable compliance with applicable regulations</li>
                <li>Strengthen leadership and organisational capability</li>
              </ul>
            </Reveal>
          </div>
        </RevealSection>

        <RevealSection
          className="about-reveal-capabilities"
          ariaLabel="Capabilities"
          eyebrow="Expertise"
          title="Multi-Domain Capability for Technical and Operational Excellence"
          compactHeader
        >
          <div className="capability-grid">
            {capabilities.map((text, index) => (
              <Reveal
                key={text}
                as="div"
                className="capability-card"
                delay={`${0.34 + index * 0.07}s`}
              >
                {text}
              </Reveal>
            ))}
          </div>
        </RevealSection>

        <div className="about-arvr-wrap">
          <AboutArVrSection />
        </div>

        <RevealSection
          className="about-reveal-sectors training-formats"
          ariaLabel="Sector coverage"
          eyebrow="Reach"
          title="Sector Coverage"
          compactHeader
        >
          <div className="formats-grid sector-coverage-grid">
            {sectors.map((sector, index) => (
              <Reveal
                key={sector.title}
                as="div"
                className="format-card"
                delay={`${0.36 + index * 0.1}s`}
              >
                <div className="format-icon">
                  <i className={`fas ${sector.icon}`}></i>
                </div>
                <h3>{sector.title}</h3>
              </Reveal>
            ))}
          </div>
        </RevealSection>

        <RevealSection
          className="about-reveal-partners"
          ariaLabel="Who we work with"
          eyebrow="Partnerships"
          title="Who We Work With"
          compactHeader
        >
          <div className="why-grid">
            {partners.map((label, index) => (
              <Reveal
                key={label}
                as="div"
                className="capability-card text-center"
                delay={`${0.36 + index * 0.08}s`}
              >
                <strong>{label}</strong>
              </Reveal>
            ))}
          </div>
        </RevealSection>

        <RevealSection
          className="about-reveal-compliance"
          ariaLabel="Compliance alignment"
          eyebrow="Standards"
          title="Compliance Alignment"
          compactHeader
        >
          <Reveal delay="0.36s">
            <p className="text-center" style={{ fontSize: "18px", lineHeight: 1.8 }}>
              <strong>
                All programs are designed and delivered in alignment with
                applicable regulatory requirements, institutional procedures,
                and relevant industry standards, ensuring audit readiness and
                compliance with governing frameworks.
              </strong>
            </p>
          </Reveal>
        </RevealSection>

        <RevealSection
          className="about-reveal-why"
          ariaLabel="Why choose Voltgrid"
          eyebrow="Why us"
          title="Why Choose Voltgrid Insights"
          compactHeader
        >
          <div className="why-grid why-choose-grid">
            {whyChoose.map((text, index) => (
              <Reveal
                key={text}
                as="div"
                className="capability-card text-center"
                delay={`${0.36 + index * 0.08}s`}
              >
                {text}
              </Reveal>
            ))}
          </div>
        </RevealSection>

        <RevealSection
          className="about-reveal-impact about-reveal-impact--banner"
          ariaLabel="Impact"
          noCard
        >
          <div className="about-impact-reveal">
            <Reveal className="about-impact-reveal-content" delay="0.12s">
              <h2>Impact</h2>
              <p>Driving Knowledge. Strengthening Systems.</p>
            </Reveal>
          </div>
        </RevealSection>

        <RevealSection
          className="about-reveal-initiatives field-initiatives-section"
          ariaLabel="Field initiatives"
          eyebrow="On the ground"
          title="Driving Knowledge. Strengthening Systems."
          description="On-ground initiatives focused on technical awareness, safety practices, and system-level understanding."
          compactHeader
        >
          <div className="field-initiatives-intro">
            <div className="field-initiatives-copy">
              <Reveal as="p" delay="0.36s">
                Voltgrid Insights has undertaken multiple on-ground initiatives
                focused on strengthening technical awareness, safety practices,
                and system-level understanding across operational environments
                and community interfaces.
              </Reveal>
              <Reveal as="p" delay="0.44s">
                These initiatives extend beyond structured programs into real
                working conditions and field environments, supporting practical
                knowledge dissemination and awareness.
              </Reveal>
            </div>
            <Reveal className="field-initiatives-image reveal-item--from-left" delay="0.4s">
              <img
                src={impactImage}
                alt="Field engagement around power infrastructure"
              />
            </Reveal>
          </div>

          <Reveal as="h3" className="head-sec mt-4 text-center" delay="0.48s">
            Our Initiatives
          </Reveal>

          <div className="field-initiatives-grid">
            {initiatives.map((initiative, index) => (
              <Reveal
                key={initiative.title}
                as="article"
                className="field-card"
                delay={`${0.52 + index * 0.08}s`}
              >
                <h3>{initiative.title}</h3>
                <p>{initiative.description}</p>
                <ul>
                  {initiative.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="field-impact-panel" delay="0.82s">
            <div className="field-impact-heading">
              <h3 className="text-center">Impact</h3>
            </div>
            <div className="field-impact-grid">
              {impactPoints.map((point, index) => (
                <Reveal
                  key={point}
                  as="div"
                  className="field-impact-item"
                  delay={`${0.88 + index * 0.06}s`}
                >
                  {point}
                </Reveal>
              ))}
            </div>
          </Reveal>
        </RevealSection>
      </div>
    </main>
  );
}
