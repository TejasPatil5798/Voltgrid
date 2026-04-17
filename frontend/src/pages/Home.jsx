import React, { useEffect, useState } from "react";
import carousel1 from "../assets/images/crousal1.jpeg";
import carousel2 from "../assets/images/crousal2.jpg";
import carousel3 from "../assets/images/crousal3.jpg";
import carousel4 from "../assets/images/crousal4.png";

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
  }, []);

  return (
    <main>
      <section className="slider">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={"slide" + (i === current ? " active" : "")}
          >
            <img
              src={s.src + "?auto=format&fit=crop&w=1600&q=80"}
              alt={s.alt}
              loading="lazy"
            />
            <div className="overlay">
              <h1 style={{ color: "white" }}>
                Capacity Building and Professional Training Across <br />
                Technical, Operational, and Management Domains
              </h1>
            </div>
          </div>
        ))}
      </section>

      <section className="features">
        <div className="card">
          <i className="fas fa-cogs"></i>
          <h3>Technical Systems</h3>
          <p>Infrastructure and engineering operations.</p>
        </div>

        <div className="card">
          <i className="fas fa-shield-alt"></i>
          <h3>Safety Training</h3>
          <p>Hazard control and compliance frameworks.</p>
        </div>

        <div className="card">
          <i className="fas fa-chart-line"></i>
          <h3>Leadership</h3>
          <p>Management and decision capability.</p>
        </div>
      </section>

      <section className="institution-section">
        <div className="institution-container">
          <div className="institution-image">
            <img
              src="src\assets\images\training.jpg"
              alt="Institutional Training"
            />
          </div>
          <div className="institution-content">
            <h2 className="head-sec"> What We Deliver</h2>
            <p>
              Voltgrid Insights delivers structured training and
              capability-building programs designed to enhance technical
              competency, operational performance, safety compliance, and
              managerial effectiveness across multiple sectors.
            </p>
            <p>
              Programs are developed based on operational requirements,
              regulatory frameworks, and industry practices, ensuring relevance
              and practical applicability in real working environments.
            </p>
          </div>
        </div>
      </section>

      <section className="program-domains">
        <div className="section-header">
          <h2>Program Domains</h2>
          <p>
            Structured professional training programs designed across technical,
            operational, compliance, and leadership domains for industry-ready
            capacity building.
          </p>
        </div>
        <div className="domains-grid">
          <div className="domain-box">
            <h3>Technical & Engineering Systems</h3>
            <ul>
              <li>Infrastructure and utility systems</li>
              <li>Equipment engineering and operations</li>
              <li>Monitoring and control systems</li>
              <li>Diagnostics and maintenance practices</li>
            </ul>
          </div>
          <div className="domain-box">
            <h3>Operations & System Management</h3>
            <ul>
              <li>System operations and coordination</li>
              <li>Monitoring platforms and decision-making tools</li>
              <li>Data-driven operational management</li>
            </ul>
          </div>
          <div className="domain-box">
            <h3>Safety & Compliance</h3>
            <ul>
              <li>Regulatory compliance frameworks</li>
              <li>Workplace safety systems</li>
              <li>Hazard identification and risk mitigation</li>
              <li>Incident investigation and corrective actions</li>
            </ul>
          </div>
          <div className="domain-box">
            <h3>Asset & Maintenance Management</h3>
            <ul>
              <li>Asset lifecycle management</li>
              <li>Preventive and condition-based maintenance</li>
              <li>Reliability-centered maintenance strategies</li>
            </ul>
          </div>
          <div className="domain-box">
            <h3>Project & Contract Management</h3>
            <ul>
              <li>Project planning and execution</li>
              <li>Contract administration and dispute management</li>
              <li>Stakeholder coordination</li>
            </ul>
          </div>
          <div className="domain-box">
            <h3>Regulatory, Financial & Leadership</h3>
            <ul>
              <li>Regulatory frameworks and compliance</li>
              <li>Financial management for technical professionals</li>
              <li>
                Leadership, team management, and organizational effectiveness
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="training-formats">
        <div className="section-header">
          <h2>Training Delivery Formats</h2>
        </div>
        <div className="formats-grid">
          <div className="format-card">
            <div className="format-icon">
              <i className="fas fa-building"></i>
            </div>
            <h3> On-site training at client locations</h3>
          </div>
          <div className="format-card">
            <div className="format-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Centralised training programs</h3>
          </div>
          <div className="format-card">
            <div className="format-icon">
              <i className="fas fa-hotel"></i>
            </div>
            <h3>
              Residential training programs (structured immersive format){" "}
            </h3>
          </div>
        </div>
        <div className="format-note">
          <p style={{ fontSize: "18px" }}>
            <strong>
              {" "}
              Residential programs are conducted subject to program design,
              batch size, and availability of suitable training facilities.
            </strong>
          </p>
        </div>
      </section>

      <section className="program-structure">
        <div className="section-header">
          <h2>Program Structure</h2>
          <p>
            Structured training modules designed to ensure competency
            development, practical relevance, and organizational adaptability.
          </p>
        </div>
        <div className="structure-grid">
          <div className="structure-card">
            <div className="structure-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Duration</h3>
            <p>
              Typically 3–5 days per program, based on subject scope,
              complexity, and participant level.
            </p>
          </div>
          <div className="structure-card">
            <div className="structure-icon">
              <i className="fas fa-layer-group"></i>
            </div>
            <h3>Format</h3>
            <p>
              Modular and competency-based structure designed to enable
              structured progression, focused learning, and practical
              understanding of key concepts.
            </p>
          </div>
          <div className="structure-card">
            <div className="structure-icon">
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <h3>Delivery</h3>
            <p>
              Instructor-led sessions supported by case-based discussions and
              application-oriented learning, delivered at client locations or
              approved training facilities to ensure relevance to real
              operational environments.
            </p>
          </div>
          <div className="structure-card">
            <div className="structure-icon">
              <i className="fas fa-sliders-h"></i>
            </div>
            <h3>Customization</h3>
            <p>
              Programs can be tailored based on sector-specific requirements,
              participant roles, and organisational needs to ensure alignment
              with operational objectives.
            </p>
          </div>
        </div>
      </section>

      <section className="key-outcomes">
        <div className="section-header">
          <h2>Key Outcomes</h2>
          <p>
            Expected institutional and operational impact from structured
            training interventions.
          </p>
        </div>
        <div className="outcomes-grid">
          <div className="outcome-box">
            <i className="fas fa-chart-line"></i>
            <h3>Operational Performance</h3>
            <p>
              Improvement in operational performance and execution capability.
            </p>
          </div>
          <div className="outcome-box">
            <i className="fas fa-check-circle"></i>
            <h3>Compliance Adherence</h3>
            <p>
              Increased adherence to procedures and compliance requirements.
            </p>
          </div>
          <div className="outcome-box">
            <i className="fas fa-shield-alt"></i>
            <h3>Risk Reduction</h3>
            <p>Reduction in operational and safety-related risks.</p>
          </div>
          <div className="outcome-box">
            <i className="fas fa-user-cog"></i>
            <h3>Capability Enhancement</h3>
            <p>Enhanced capability in technical and managerial functions.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
