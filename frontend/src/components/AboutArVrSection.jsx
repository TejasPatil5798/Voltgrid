import React, { useEffect, useRef } from "react";
import overviewImage from "../assets/images/imp.jpg";
import missionImage from "../assets/images/mission.jpg";
import impactImage from "../assets/images/Impact.jpg";

const carouselImages = [
  { src: overviewImage, alt: "Collaborative professional training and planning" },
  { src: missionImage, alt: "Mission-led workforce development" },
  { src: impactImage, alt: "Field engagement and operational learning" },
];

const pillars = [
  {
    icon: "fa-shield-alt",
    title: "Practice without risk",
    text: "Teams rehearse high-consequence procedures in virtual environments before touching live systems.",
  },
  {
    icon: "fa-brain",
    title: "Learn by immersion",
    text: "Spatial, hands-on experiences improve retention compared to presentation-only formats alone.",
  },
  {
    icon: "fa-chart-line",
    title: "Measure readiness",
    text: "Repeatable scenarios help institutions validate competency before deployment to the field.",
  },
];

const timeline = [
  { step: "01", label: "Assess", detail: "Operational gaps & learning objectives" },
  { step: "02", label: "Design", detail: "AR/VR modules aligned to your systems" },
  { step: "03", label: "Deliver", detail: "Blended immersive + instructor-led sessions" },
  { step: "04", label: "Apply", detail: "Transfer skills to real working environments" },
];

const highlights = [
  { icon: "fa-bolt", label: "Experiential" },
  { icon: "fa-chart-bar", label: "Measurable" },
  { icon: "fa-cogs", label: "Systems-aligned" },
];

export default function AboutArVrSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="about-arvr"
      aria-labelledby="about-arvr-title"
    >
      <div className="about-arvr-card">
        <header className="about-arvr-hero">
          <div className="about-arvr-hero-bg" aria-hidden="true">
            <span className="about-arvr-hero-mesh" />
            <span className="about-arvr-hero-glow about-arvr-hero-glow-1" />
            <span className="about-arvr-hero-glow about-arvr-hero-glow-2" />
            <span className="about-arvr-hero-scan" />
            <span className="about-arvr-hero-icon about-arvr-hero-icon-1">
              <i className="fas fa-vr-cardboard" />
            </span>
            <span className="about-arvr-hero-icon about-arvr-hero-icon-2">
              <i className="fas fa-cube" />
            </span>
            <span className="about-arvr-hero-icon about-arvr-hero-icon-3">
              <i className="fas fa-headset" />
            </span>
          </div>

          <div className="about-arvr-hero-content">
            <span className="about-arvr-eyebrow about-arvr-animate" style={{ "--d": "0.05s" }}>
              <span className="about-arvr-eyebrow-dot" />
              How we teach
            </span>

            <h2 id="about-arvr-title" className="about-arvr-title about-arvr-animate" style={{ "--d": "0.15s" }}>
              <span className="about-arvr-title-line">Immersive learning with</span>
              <span className="about-arvr-title-accent">
                <span className="about-arvr-badge-ar">AR</span>
                <span className="about-arvr-title-amp">&</span>
                <span className="about-arvr-badge-vr">VR</span>
              </span>
            </h2>

            <p className="about-arvr-lead about-arvr-animate" style={{ "--d": "0.28s" }}>
              Voltgrid Insights combines structured classroom delivery with augmented
              and virtual reality—so capability-building is{" "}
              <strong>experiential</strong>, <strong>measurable</strong>, and aligned
              to the systems your people actually operate.
            </p>

            <div className="about-arvr-highlights about-arvr-animate" style={{ "--d": "0.4s" }}>
              {highlights.map((item) => (
                <span key={item.label} className="about-arvr-highlight-chip">
                  <i className={`fas ${item.icon}`} aria-hidden="true" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="about-arvr-main">
          <div className="about-arvr-body">
            <ul className="about-arvr-pillars">
              {pillars.map((pillar, index) => (
                <li
                  key={pillar.title}
                  className="about-arvr-pillar about-arvr-animate"
                  style={{ "--d": `${0.5 + index * 0.08}s` }}
                >
                  <span className="about-arvr-pillar-icon">
                    <i className={`fas ${pillar.icon}`} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="about-arvr-showcase about-arvr-animate" style={{ "--d": "0.72s" }}>
              <div className="about-arvr-frame">
                <span className="about-arvr-frame-ring" aria-hidden="true" />
                <div className="about-arvr-carousel">
                  {carouselImages.map((img, index) => (
                    <img
                      key={img.alt}
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      style={{ animationDelay: `${index * 4}s` }}
                    />
                  ))}
                </div>
                <div className="about-arvr-hud">
                  <span>
                    <i className="fas fa-vr-cardboard" aria-hidden="true" /> VR Lab
                  </span>
                  <span>
                    <i className="fas fa-cube" aria-hidden="true" /> AR Assist
                  </span>
                </div>
              </div>
              <div className="about-arvr-orbit" aria-hidden="true">
                <span className="about-arvr-orbit-dot about-arvr-orbit-dot-1" />
                <span className="about-arvr-orbit-dot about-arvr-orbit-dot-2" />
                <span className="about-arvr-orbit-dot about-arvr-orbit-dot-3" />
              </div>
            </div>

            <div className="about-arvr-timeline about-arvr-animate" style={{ "--d": "0.82s" }}>
              <span className="about-arvr-timeline-track" aria-hidden="true" />
              {timeline.map((item, index) => (
                <div key={item.step} className="about-arvr-timeline-step">
                  <span
                    className="about-arvr-timeline-node"
                    style={{ "--step-delay": `${index * 0.6}s` }}
                  >
                    {item.step}
                  </span>
                  <div className="about-arvr-timeline-copy">
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <blockquote className="about-arvr-quote about-arvr-animate" style={{ "--d": "0.88s" }}>
            <p>
              “Our commitment is not technology for its own sake—immersive tools are
              integrated where they materially improve understanding, safety, and
              operational readiness.”
            </p>
            <cite>— Voltgrid Insights learning philosophy</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
