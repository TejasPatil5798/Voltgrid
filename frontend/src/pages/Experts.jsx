import React, { useEffect, useState } from "react";
import ExpertCard from "../components/ExpertCard";
import RegisterModal from "../components/RegisterModal";
import ImageLightbox from "../components/ImageLightbox";
import { apiUrl } from "../lib/api";
import expertsHeroImage from "../assets/images/IMG-20220502-WA0001.jpg";

const fallbackExperts = [];

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
        setExperts(data || []);
      } catch (e) {
        console.error("Error loading experts:", e);
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
    if (!src) return;
    setPreviewImage({ src, alt });
  }

  return (
    <main>
      {/* HERO */}
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

      <div className="page-main container pt-0">

        {/* CTA */}
        <section className="experts-cta card">
          <div>
            <h2 className="head-sec">Join as an Expert</h2>
            <p>Professionals with relevant industry experience can register.</p>

            <button
              className="btn btn-danger reg-button"
              onClick={() => openRegister()}
            >
              Register as Expert
            </button>
          </div>
        </section>

        {/* WHO CAN REGISTER */}
        <section className="safety-surface mt-5">
          <div className="section-header safety-subheader">
            <h2>Who Can Register</h2>
          </div>

          <div className="safety-grid">
            {WhoCanRegister.map((item, i) => (
              <div key={i} className="safety-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* EXPERT LIST */}
        <section className="section-header experts-section-header">
          <h2>Expert Profiles</h2>
        </section>

        <div className="grid-list experts-grid">
          {experts.length === 0 ? (
            <p style={{ textAlign: "center" }}>No experts available</p>
          ) : (
            experts.map((ex) => (
              <div key={ex.id || ex._id}>
                <ExpertCard
                  expert={ex}
                  onRegister={openRegister}
                  onPhotoClick={(src) =>
                    openPreview(apiUrl(src), ex.name)
                  }
                />
              </div>
            ))
          )}
        </div>

        {/* DOMAINS */}
        <section className="experts-domains-section">
          <div className="experts-domain-grid">
            {domainBlocks.map((block, i) => (
              <article key={i} className="experts-domain-card card">
                <h3>{block.title}</h3>
                <ul>
                  {block.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* MODALS */}
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