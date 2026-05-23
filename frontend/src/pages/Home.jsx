import React, { useEffect, useState } from "react";
import carousel1 from "../assets/images/crousal1.jpeg";
import carousel2 from "../assets/images/crousal2.jpg";
import carousel3 from "../assets/images/crousal3.jpg";
import carousel4 from "../assets/images/crousal4.png";
import trainingImg from "../assets/images/training.jpg";
import RevealSection, { Reveal } from "../components/RevealSection";

export default function Home() {
  const slides = [
    {
      src: carousel1,
      alt: "Training session 1",
    },
    {
      src: carousel2,
      alt: "Training session 2",
    },
    {
      src: carousel3,
      alt: "Training session 3",
    },
    {
      src: carousel4,
      alt: "Training session 4",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);

    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <main className="home-page">
      <section className="slider home-hero" aria-label="Featured training highlights">
        <div className="home-hero-ambient" aria-hidden="true">
          <span className="home-hero-shine" />
          <span className="home-hero-grid" />
        </div>

        {slides.map((s, i) => (
          <div
            key={i}
            className={"slide" + (i === current ? " active" : "")}
            aria-hidden={i !== current}
          >
            <img src={s.src} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} />
            <span className="slide-scrim" aria-hidden="true" />
            {i === current && (
              <div className="overlay">
                <span className="home-hero-eyebrow home-hero-reveal">
                  Voltgrid Insights
                </span>
                <h1 key={`title-${current}`} className="hero-slide-title home-hero-reveal home-hero-reveal-delay">
                  Capacity Building and Professional Training Across Technical,
                  Operational, and Management Domains
                </h1>
                <p key={`lead-${current}`} className="home-hero-lead home-hero-reveal home-hero-reveal-delay-2">
                  Structured programs for technical excellence, operational performance,
                  and leadership capability.
                </p>
              </div>
            )}
          </div>
        ))}

        <div className="home-hero-ui">
          <div className="home-hero-dots" role="tablist" aria-label="Carousel slides">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                className={"home-hero-dot" + (i === current ? " is-active" : "")}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
          <div className="home-hero-progress" aria-hidden="true">
            <span key={current} className="home-hero-progress-bar" />
          </div>
        </div>

        <span className="home-hero-scroll" aria-hidden="true">
          <i className="fas fa-chevron-down" />
        </span>
      </section>

      <RevealSection
        className="features"
        ariaLabel="Core training areas"
        eyebrow="Core capabilities"
        title="Built for technical, safety, and leadership excellence"
        compactHeader
      >
        <div className="features-grid">
          <Reveal as="div" className="card" delay="0.38s">
            <i className="fas fa-cogs"></i>
            <h3>Technical Systems</h3>
            <p>Infrastructure and engineering operations.</p>
          </Reveal>

          <Reveal as="div" className="card" delay="0.48s">
            <i className="fas fa-shield-alt"></i>
            <h3>Safety Training</h3>
            <p>Hazard control and compliance frameworks.</p>
          </Reveal>

          <Reveal as="div" className="card" delay="0.58s">
            <i className="fas fa-chart-line"></i>
            <h3>Leadership</h3>
            <p>Management and decision capability.</p>
          </Reveal>
        </div>
      </RevealSection>

      <RevealSection
        className="institution-section"
        ariaLabel="What we deliver"
        eyebrow="Institutional training"
        title="What We Deliver"
        headerTone="dark"
        compactHeader
      >
        <div className="institution-container">
          <Reveal className="institution-image reveal-item--from-left" delay="0.36s">
            <img src={trainingImg} alt="Institutional Training" />
          </Reveal>
          <div className="institution-content">
            <Reveal as="p" delay="0.44s">
              Voltgrid Insights delivers structured training and
              capability-building programs designed to enhance technical
              competency, operational performance, safety compliance, and
              managerial effectiveness across multiple sectors.
            </Reveal>
            <Reveal as="p" delay="0.54s">
              Programs are developed based on operational requirements,
              regulatory frameworks, and industry practices, ensuring relevance
              and practical applicability in real working environments.
            </Reveal>
          </div>
        </div>
      </RevealSection>

      <RevealSection
        className="program-domains"
        ariaLabel="Program domains"
        eyebrow="Training scope"
        title="Program Domains"
        description="Structured professional training programs designed across technical, operational, compliance, and leadership domains for industry-ready capacity building."
      >
        <div className="domains-grid">
          {[
            {
              title: "Technical & Engineering Systems",
              items: [
                "Infrastructure and utility systems",
                "Equipment engineering and operations",
                "Monitoring and control systems",
                "Diagnostics and maintenance practices",
              ],
            },
            {
              title: "Operations & System Management",
              items: [
                "System operations and coordination",
                "Monitoring platforms and decision-making tools",
                "Data-driven operational management",
              ],
            },
            {
              title: "Safety & Compliance",
              items: [
                "Regulatory compliance frameworks",
                "Workplace safety systems",
                "Hazard identification and risk mitigation",
                "Incident investigation and corrective actions",
              ],
            },
            {
              title: "Asset & Maintenance Management",
              items: [
                "Asset lifecycle management",
                "Preventive and condition-based maintenance",
                "Reliability-centered maintenance strategies",
              ],
            },
            {
              title: "Project & Contract Management",
              items: [
                "Project planning and execution",
                "Contract administration and dispute management",
                "Stakeholder coordination",
              ],
            },
            {
              title: "Regulatory, Financial & Leadership",
              items: [
                "Regulatory frameworks and compliance",
                "Financial management for technical professionals",
                "Leadership, team management, and organizational effectiveness",
              ],
            },
          ].map((domain, index) => (
            <Reveal
              key={domain.title}
              as="div"
              className="domain-box"
              delay={`${0.34 + index * 0.08}s`}
            >
              <h3>{domain.title}</h3>
              <ul>
                {domain.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </RevealSection>

      <RevealSection
        className="training-formats"
        ariaLabel="Training delivery formats"
        eyebrow="How we deliver"
        title="Training Delivery Formats"
      >
        <div className="formats-grid">
          <Reveal as="div" className="format-card" delay="0.36s">
            <div className="format-icon">
              <i className="fas fa-building"></i>
            </div>
            <h3>On-site training at client locations</h3>
          </Reveal>

          <Reveal as="div" className="format-card" delay="0.46s">
            <div className="format-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Centralised training programs</h3>
          </Reveal>

          <Reveal as="div" className="format-card" delay="0.56s">
            <div className="format-icon">
              <i className="fas fa-hotel"></i>
            </div>
            <h3>Residential training programs (structured immersive format)</h3>
          </Reveal>
        </div>

        <Reveal className="format-note reveal-item--from-left" delay="0.66s">
          <p style={{ fontSize: "18px" }}>
            <strong>
              Residential programs are conducted subject to program design,
              batch size, and availability of suitable training facilities.
            </strong>
          </p>
        </Reveal>
      </RevealSection>

      <RevealSection
        className="program-structure"
        ariaLabel="Program structure"
        eyebrow="Program design"
        title="Program Structure"
        description="Structured training modules designed to ensure competency development, practical relevance, and organizational adaptability."
      >
        <div className="structure-grid">
          {[
            {
              icon: "fa-clock",
              title: "Duration",
              text: "Typically 3–5 days per program, based on subject scope, complexity, and participant level.",
            },
            {
              icon: "fa-layer-group",
              title: "Format",
              text: "Modular and competency-based structure designed to enable structured progression, focused learning, and practical understanding of key concepts.",
            },
            {
              icon: "fa-chalkboard-teacher",
              title: "Delivery",
              text: "Instructor-led sessions supported by case-based discussions and application-oriented learning, delivered at client locations or approved training facilities to ensure relevance to real operational environments.",
            },
            {
              icon: "fa-sliders-h",
              title: "Customization",
              text: "Programs can be tailored based on sector-specific requirements, participant roles, and organisational needs to ensure alignment with operational objectives.",
            },
          ].map((item, index) => (
            <Reveal
              key={item.title}
              as="div"
              className="structure-card text-center"
              delay={`${0.36 + index * 0.1}s`}
            >
              <div className="structure-icon">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </RevealSection>

      <RevealSection
        className="key-outcomes"
        ariaLabel="Key outcomes"
        eyebrow="Impact"
        title="Key Outcomes"
        description="Expected institutional and operational impact from structured training interventions."
      >
        <div className="outcomes-grid">
          {[
            { icon: "fa-chart-line", title: "Operational Performance", text: "Improvement in operational performance and execution capability." },
            { icon: "fa-check-circle", title: "Compliance Adherence", text: "Increased adherence to procedures and compliance requirements." },
            { icon: "fa-shield-alt", title: "Risk Reduction", text: "Reduction in operational and safety-related risks." },
            { icon: "fa-user-cog", title: "Capability Enhancement", text: "Enhanced capability in technical and managerial functions." },
          ].map((outcome, index) => (
            <Reveal
              key={outcome.title}
              as="div"
              className="outcome-box"
              delay={`${0.36 + index * 0.1}s`}
            >
              <i className={`fas ${outcome.icon}`}></i>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </Reveal>
          ))}
        </div>
      </RevealSection>
    </main>
  );
}
