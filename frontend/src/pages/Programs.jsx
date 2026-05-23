import React from "react";
import ProgramsArVrSection from "../components/ProgramsArVrSection";
import RevealSection, { Reveal } from "../components/RevealSection";
import programsHeroImage from "../assets/images/IMG-20220502-WA0001.jpg";
import trainingImage from "../assets/images/training.jpg";
import towersImage from "../assets/images/towers.jpg";
import residentialImage from "../assets/images/pexels-pavel-danilyuk-8761523.jpg";
import programVideo from "../assets/videos/Futuristic_education_VR_training_202605221306.mp4";
import immersiveLearningVideo from "../assets/videos/Untitled video.mp4";

const programCategories = [
  "Technical & Engineering Systems",
  "Operations & Control Systems",
  "Safety & Compliance",
  "Asset & Maintenance Management",
  "Project & Contract Management",
  "Regulatory, Financial & Leadership Development",
];

const customizationPoints = [
  "Sector requirements",
  "Participant roles and experience levels",
  "Specific operational challenges",
];

const approachPoints = [
  "Modular and structured delivery",
  "Outcome-focused training design",
  "Sector-adaptable content",
];

const methodsUsed = [
  "Technical sessions",
  "Case studies",
  "Simulation-based learning (including VR/AR where applicable)",
  "Scenario-based exercises",
];

const residentialPoints = [
  "Continuous faculty interaction",
  "Extended learning sessions",
  "Group-based exercises and discussions",
  "Practical and scenario-based engagement",
];

export default function Programs() {
  return (
    <main className="programs-page-main">
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${programsHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Training Programs</h1>
            <p>
              Structured learning programs across technical, operational,
              safety, maintenance, project, and leadership domains for
              measurable capability development.
            </p>
          </div>
        </div>
      </section>

      <div id="training-programs" className="programs-page programs-page--reveal">
        <RevealSection
          className="programs-reveal-intro"
          ariaLabel="Training programs overview"
          eyebrow="Learning paths"
          title="Training Programs"
          description="Programs are delivered through a modular and structured framework that supports practical learning, customization, and operational relevance."
          compactHeader
        >
          <div className="programs-feature-card">
            <Reveal className="programs-feature-media reveal-item--from-left" delay="0.36s">
              <img
                src={trainingImage}
                alt="Training program planning and structured delivery"
                loading="lazy"
              />
            </Reveal>
            <div className="programs-feature-copy">
              <Reveal as="h3" className="head-sec text-center" delay="0.42s">
                Program Structure
              </Reveal>
              <Reveal as="p" delay="0.5s">
                Programs are offered as modular training units, typically
                structured over 3–5 days.
              </Reveal>
            </div>
          </div>
        </RevealSection>

        <RevealSection
          className="programs-reveal-categories"
          ariaLabel="Program categories"
          eyebrow="Domains"
          title="Program Categories"
          compactHeader
        >
          <div className="program-categories-grid">
            {programCategories.map((category, index) => (
              <Reveal
                key={category}
                as="div"
                className="program-category-card"
                delay={`${0.34 + index * 0.07}s`}
              >
                {category}
              </Reveal>
            ))}
          </div>
        </RevealSection>
      </div>

      <RevealSection
        className="programs-reveal-video"
        ariaLabel="Immersive training preview"
        noCard
      >
        <Reveal delay="0.08s">
          <section className="program-video-section">
            <video
              className="program-video"
              src={programVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </section>
        </Reveal>
      </RevealSection>

      <div className="programs-arvr-wrap">
        <ProgramsArVrSection />
      </div>

      <RevealSection
        className="programs-reveal-video programs-reveal-video--secondary"
        ariaLabel="Immersive learning preview"
        noCard
      >
        <Reveal delay="0.08s">
          <section className="program-video-section">
            <video
              className="program-video"
              src={immersiveLearningVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </section>
        </Reveal>
      </RevealSection>

      <div className="programs-page programs-page--reveal">
        <RevealSection
          className="programs-reveal-custom"
          ariaLabel="Customized programs"
          eyebrow="Tailored delivery"
          title="Customized Programs"
          description="Programs can be adapted to your sector, roles, and operational context."
          compactHeader
        >
          <div className="programs-feature-card programs-feature-card-reverse">
            <div className="programs-feature-copy">
              <Reveal as="p" delay="0.36s">
                Programs can be customized based on:
              </Reveal>
              <Reveal as="ul" className="programs-list" delay="0.44s">
                {customizationPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </Reveal>
            </div>
            <Reveal className="programs-feature-media reveal-item--from-left" delay="0.4s">
              <img
                src={towersImage}
                alt="Customized training programs and participant engagement"
                loading="lazy"
              />
            </Reveal>
          </div>
        </RevealSection>

        <RevealSection
          className="programs-reveal-methodology"
          ariaLabel="Training methodology"
          eyebrow="How we teach"
          title="Training Methodology"
          description="Structured approach, proven methods, and immersive residential learning where applicable."
          compactHeader
        >
          <div className="programs-methodology-grid">
            <Reveal as="article" className="programs-method-card" delay="0.36s">
              <h3 className="head-sec text-center">Approach</h3>
              <ul className="programs-list">
                {approachPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="article" className="programs-method-card" delay="0.46s">
              <h3 className="head-sec text-center">Methods Used</h3>
              <ul className="programs-list">
                {methodsUsed.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="programs-residential-panel" delay="0.56s">
            <div className="programs-residential-copy">
              <h3 className="text-center">Residential Learning Model</h3>
              <p>
                Residential programs follow an immersive learning approach,
                including:
              </p>
              <ul className="programs-list programs-list-light">
                {residentialPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="programs-residential-note">
                This format improves knowledge retention and application
                capability, subject to facility and batch planning.
              </p>
            </div>
            <div className="programs-residential-media">
              <img
                src={residentialImage}
                alt="Residential learning and immersive group engagement"
                loading="lazy"
              />
            </div>
          </Reveal>
        </RevealSection>
      </div>
    </main>
  );
}
