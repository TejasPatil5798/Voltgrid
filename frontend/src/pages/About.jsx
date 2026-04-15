import React from "react";

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
      <section className="about-hero">
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
        <div className="section-header about-header">
          <span className="section-tag">About Voltgrid Insights</span>
          <h2>Capability-Building with Operational Relevance</h2>
          <p>
            Structured institutional training framework designed for technical,
            operational, managerial, and compliance-focused capacity building.
          </p>
        </div>
        <div className="about-row about-feature-card">
          <div className="about-image about-media">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
              alt="Professional training and planning discussion"
            />
          </div>
          <div className="about-text">
            <h2>Overview</h2>
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
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Collaborative workforce vision"
            />
            <h2>Vision</h2>
            <p>
              To develop a{" "}
              <strong>
                competent, compliant, and performance-oriented workforce
              </strong>{" "}
              across sectors.
            </p>
          </div>
          <div className="info-card">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
              alt="Mission-led professional development"
            />
            <h2>Mission</h2>
            <ul className="about-check-list">
              <li>Deliver structured and measurable programs </li>
              <li>Improve operational efficiency and system performance</li>
              <li>Enable compliance with applicable regulations</li>
              <li>Strengthen leadership and organisational capability</li>
            </ul>
          </div>
        </div>

        <div className="capabilities-section about-surface">
          <div className="section-header about-subheader">
            <span className="section-tag">Core Capabilities</span>
            <h2>Multi-Domain Expertise for Institutional Learning</h2>
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

        <div className="about-row reverse about-feature-card">
          <div className="about-text">
            <span className="section-tag">Sector Coverage</span>
            <h2>Sector Coverage</h2>
            <p>
              Programs are adaptable across utility, infrastructure, industrial,
              and public-sector environments where operational reliability and
              workforce capability are critical.
            </p>
            <ul className="about-check-list">
              <li>Power and Energy</li>
              <li>Infrastructure and Utilities</li>
              <li>Manufacturing and Industrial Systems</li>
              <li>Government and Public Administration</li>
            </ul>
          </div>
          <div className="about-image about-media">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt="Sector coverage across corporate and institutional environments"
            />
          </div>
        </div>

        <div className="why-section about-surface">
          <div className="section-header about-subheader">
            <span className="section-tag">Who We Work With</span>
            <h2>Institutional and Industry-Focused Engagement</h2>
          </div>
          <div className="why-grid">
            <div className="why-card">Government Departments</div>
            <div className="why-card">Public Sector Undertakings (PSUs)</div>
            <div className="why-card">
              Infrastructure and Utility Organizations{" "}
            </div>
            <div className="why-card">
              Industrial and Manufacturing Enterprises
            </div>
          </div>
        </div>

        <div className="about-row about-feature-card about-compliance-card">
          <div className="about-image about-media">
            <img
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"
              alt="Compliance alignment and standards-led execution"
            />
          </div>
          <div className="about-text">
            <span className="section-tag">Compliance Alignment</span>
            <h2>Compliance Alignment</h2>
            <p>
              Programs are aligned with applicable regulatory frameworks,
              organisational procedures, and industry standards.
            </p>
            <div className="about-inline-note">
              Alignment supports consistency, operational discipline, and
              practical adoption in real working environments.
            </div>
          </div>
        </div>

        <div className="why-section about-surface">
          <div className="section-header about-subheader">
            <span className="section-tag">Why Choose Us</span>
            <h2>Why Choose Voltgrid Insights</h2>
          </div>
          <div className="why-grid">
            <div className="why-card">
              Structured and competency-based approach
            </div>
            <div className="why-card">
              Programs aligned with operational requirements and industry
              practices{" "}
            </div>
            <div className="why-card">
              Multi-domain capability across technical, operational, and
              management areas
            </div>
            <div className="why-card">
              Flexible delivery formats including residential programs
            </div>
            <div className="why-card">
              Focus on practical application and measurable outcomes
            </div>
          </div>
        </div>

        <section className="field-initiatives-section">
          <div className="field-initiatives-intro">
            <div className="field-initiatives-copy">
              <span className="section-tag">Field Initiatives & Impact</span>
              <h2>Driving Knowledge. Strengthening Systems.</h2>
              <p>
                Voltgrid Insights has undertaken multiple on-ground
                initiatives focused on strengthening technical awareness,
                safety practices, and system-level understanding across
                operational environments and community interfaces.
              </p>
              <p>
                These initiatives extend beyond structured programs into real
                working conditions and field environments, supporting practical
                knowledge dissemination and awareness.
              </p>
            </div>
            <div className="field-initiatives-image">
              <img
                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80"
                alt="Field engagement around power infrastructure"
              />
            </div>
          </div>

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
              <h3>Impact</h3>
              <p>
                These initiatives strengthen awareness, improve safer behavior,
                and support more confident field-level responses in practical
                environments.
              </p>
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
