import React, { useEffect, useState } from "react";
import ExpertCard from "../components/ExpertCard";
import RegisterModal from "../components/RegisterModal";
import ImageLightbox from "../components/ImageLightbox";
import { apiUrl } from "../lib/api";
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

const EngagementScope = [
  "Participation in training programs",
  "Contribution to knowledge-sharing initiatives",
  "Involvement in field-level awareness and capacity-building activities",
  "Support in program design and development based on domain expertise",
];

const capabilityHighlights = [
  "Programs aligned with operational requirements and industry practices",
  "Delivery support for government, PSU, utility, and industrial environments",
  "Modular 3-5 day formats with practical and scenario-based learning",
  "Focus on measurable outcomes, compliance adherence, and risk reduction",
];

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(apiUrl("/api/experts"));
        if (!res.ok) throw new Error("Failed to load experts");
        const data = await res.json();
        setExperts(data);
      } catch (e) {
        setExperts(fallbackExperts);
      }
    }
    load();
  }, []);

  function openRegister(expert = null) {
    setSelectedExpert(expert);
    setShowRegister(true);
  }

  function openPreview(src, alt) {
    setPreviewImage({ src, alt });
  }

  return (
    <main>
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
              engagement, aligned with real operational environments.
            </p>
          </div>
        </div>
      </section>

      <div className="page-main container pt-0">
      <section className="experts-cta card">
        <div>
          <h2 className="head-sec">Join as an Expert</h2>
          <p>
            Professionals with relevant industry experience can register to be
            part of the expert network.
          </p>
          <p>
            Registered profiles are reviewed and, upon approval, featured in the
            Expert Gallery.
          </p>

          <button
            className="btn btn-danger reg-button"
            onClick={() => openRegister()}
          >
            Register as a Expert
          </button>
        </div>
      </section>

      <section className="safety-surface mt-5">
        <div className="section-header safety-subheader">
          <h2>Who Can Register</h2>
        </div>
        <div className="safety-grid justify-content-center">
          {WhoCanRegister.map((item) => (
            <div key={item} className="safety-card">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="safety-surface mt-5">
        <div className="section-header safety-subheader">
          <h2>Engagement Scope</h2>
        </div>
        <div className="safety-grid justify-content-center">
          {EngagementScope.map((item) => (
            <div key={item} className="safety-card">
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="section-header experts-section-header">
        <h2>Expert Profiles</h2>
        <p>
          Faculty engagement is structured to support sector-relevant training
          delivery, practical applicability, and measurable learning outcomes.
        </p>
      </section>

      <div className="grid-list experts-grid">
        {experts.map((ex) => (
          <div key={ex.id}>
            <ExpertCard
              expert={ex}
              onRegister={openRegister}
              onPhotoClick={openPreview}
            />
          </div>
        ))}
      </div>

      <section className="experts-domains-section">
        <div className="section-header experts-section-header">
          <h2>Training Domains Supported</h2>
          <p>
            Programs span technical, operational, safety, maintenance, project,
            regulatory, and leadership areas in line with the approved website
            content.
          </p>
        </div>
        <div className="experts-domain-grid">
          {domainBlocks.map((block) => (
            <article key={block.title} className="experts-domain-card card">
              <h3>{block.title}</h3>
              <ul>
                {block.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {showRegister && (
        <RegisterModal
          expert={selectedExpert}
          onClose={() => setShowRegister(false)}
        />
      )}
      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
      </div>
    </main>
  );
}
