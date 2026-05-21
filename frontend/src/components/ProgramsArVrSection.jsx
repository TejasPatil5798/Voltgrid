import React from "react";
import trainingImage from "../assets/images/training.jpg";
import towersImage from "../assets/images/towers.jpg";
import residentialImage from "../assets/images/pexels-pavel-danilyuk-8761523.jpg";

const gallery = [
  {
    src: trainingImage,
    alt: "Instructor-led technical training with immersive simulation tools",
    label: "VR simulation labs",
    delay: "0s",
  },
  {
    src: towersImage,
    alt: "Industrial infrastructure and field operations training context",
    label: "AR field guidance",
    delay: "0.8s",
  },
  {
    src: residentialImage,
    alt: "Collaborative immersive learning and group-based exercises",
    label: "Scenario rehearsal",
    delay: "1.6s",
  },
];

const capabilities = [
  {
    icon: "fa-vr-cardboard",
    title: "Virtual Reality (VR)",
    text: "Fully immersive environments for equipment operation, safety drills, and procedural walkthroughs without operational risk.",
  },
  {
    icon: "fa-cube",
    title: "Augmented Reality (AR)",
    text: "Real-world overlays for maintenance guidance, hazard identification, and step-by-step task support on live assets.",
  },
  {
    icon: "fa-network-wired",
    title: "Digital twin & simulation",
    text: "Scenario-based exercises aligned to your systems, workflows, and compliance requirements for measurable skill transfer.",
  },
];

const highlights = [
  "High-risk procedure rehearsal in a safe virtual environment",
  "Spatial understanding of complex systems and plant layouts",
  "Faster competency validation through repeatable scenarios",
  "Blended with instructor-led sessions and case-based learning",
];

const stats = [
  { value: "3–5", label: "Day modular programs" },
  { value: "360°", label: "Immersive scenarios" },
  { value: "100%", label: "Customizable to sector" },
];

export default function ProgramsArVrSection() {
  return (
    <section className="programs-arvr" aria-labelledby="programs-arvr-title">
      <div className="programs-arvr-ambient" aria-hidden="true">
        <span className="programs-arvr-orb programs-arvr-orb-1" />
        <span className="programs-arvr-orb programs-arvr-orb-2" />
        <span className="programs-arvr-grid" />
      </div>

      <div className="programs-arvr-inner">
        <div className="programs-arvr-copy">
          <span className="section-tag programs-arvr-tag">Immersive learning</span>
          <h2 id="programs-arvr-title" className="programs-arvr-title">
            AR / VR Training Experiences
          </h2>
          <p className="programs-arvr-lead">
            Voltgrid integrates augmented and virtual reality into technical,
            safety, and operational programs—so teams practice real decisions in
            realistic environments before they enter the field.
          </p>
          <ul className="programs-arvr-highlights">
            {highlights.map((item) => (
              <li key={item}>
                <i className="fas fa-check-circle" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="programs-arvr-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="programs-arvr-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="programs-arvr-visual">
          <div className="programs-arvr-stage">
            <span className="programs-arvr-ring" aria-hidden="true" />
            <span className="programs-arvr-ring programs-arvr-ring-2" aria-hidden="true" />
            <span className="programs-arvr-scanline" aria-hidden="true" />

            <div className="programs-arvr-main-card">
              <img
                src={gallery[0].src}
                alt={gallery[0].alt}
                loading="lazy"
              />
              <span className="programs-arvr-card-label">{gallery[0].label}</span>
              <span className="programs-arvr-live">
                <span className="programs-arvr-live-dot" />
                Live simulation
              </span>
            </div>

            {gallery.slice(1).map((item, index) => (
              <div
                key={item.label}
                className={`programs-arvr-float-card programs-arvr-float-${index + 1}`}
                style={{ animationDelay: item.delay }}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                <span>{item.label}</span>
              </div>
            ))}

            <span className="programs-arvr-badge programs-arvr-badge-vr">VR</span>
            <span className="programs-arvr-badge programs-arvr-badge-ar">AR</span>
            <span className="programs-arvr-badge programs-arvr-badge-3d">3D</span>
          </div>
        </div>
      </div>

      <div className="programs-arvr-cards">
        {capabilities.map((cap) => (
          <article key={cap.title} className="programs-arvr-card">
            <span className="programs-arvr-card-icon" aria-hidden="true">
              <i className={`fas ${cap.icon}`} />
            </span>
            <h3>{cap.title}</h3>
            <p>{cap.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
