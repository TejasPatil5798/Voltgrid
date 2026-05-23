import React, { useRef } from "react";
import RevealSection, { Reveal } from "../components/RevealSection";
import { apiUrl } from "../lib/api";
import contactHeroImage from "../assets/images/contact-hero.jpeg";

const contactIntro = {
  title: "Voltgrid Insights",
  text: "Professional training and capability-building platform for technical, operational, and compliance-focused learning.",
};

const contactReach = [
  {
    title: "Email",
    text: "contact@voltgridinsights.com",
  },
  {
    title: "Registered Address",
    text: "VASWANI CHAMBERS, WORLI, MUMBAI, MAHARASHTRA-400030",
  },
];

const enquiryTopics = [
  "Training programs",
  "Customized institutional programs",
  "Safety and compliance learning",
  "Partnerships and collaborations",
];

const googleFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdk2Rk-MGz8gcAOvwbHqrNhlC_JxrXGOxeodFfGv5uHrnDFtQ/viewform?usp=pp_url";
const googleFormEmbedUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdk2Rk-MGz8gcAOvwbHqrNhlC_JxrXGOxeodFfGv5uHrnDFtQ/viewform?embedded=true";

function trackGoogleFormSubmission() {
  fetch(apiUrl("/api/contact/google"), { method: "POST" }).catch(() => {});
}

export default function Contact() {
  const formLoadCount = useRef(0);

  function handleFormEmbedLoad() {
    formLoadCount.current += 1;
    if (formLoadCount.current > 1) {
      trackGoogleFormSubmission();
    }
  }

  return (
    <main className="contact-page-main">
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${contactHeroImage})`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>Connect with Voltgrid Insights</h1>
            <p>
              Reach out for training programs, customized institutional
              learning, partnerships, and capability-building enquiries.
            </p>
          </div>
        </div>
      </section>

      <div className="contact-page contact-page--reveal">
        <RevealSection
          className="contact-reveal-main"
          ariaLabel="Contact information and form"
          eyebrow="Get in touch"
          title="We’d Be Glad to Support Your Training Requirement"
          description="Share your requirement and we will connect your enquiry to the most relevant program area, learning format, or engagement track."
          compactHeader
        >
          <div className="contact-grid">
            <div className="contact-info-panel">
              <div className="contact-card-grid">
                <Reveal as="div" className="contact-card" delay="0.34s">
                  <h3 className="head-sec text-center">{contactIntro.title}</h3>
                  <p>{contactIntro.text}</p>
                </Reveal>

                <Reveal
                  as="div"
                  className="contact-card contact-card--reach"
                  delay="0.42s"
                >
                  {contactReach.map((item) => (
                    <div key={item.title} className="contact-reach-item">
                      <h3 className="head-sec">{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </Reveal>
              </div>

              <Reveal className="contact-highlight-panel" delay="0.5s">
                <h3 className="text-center">How We Can Help</h3>
                <div className="contact-topic-grid">
                  {enquiryTopics.map((topic, index) => (
                    <Reveal
                      key={topic}
                      as="div"
                      className="contact-topic-card"
                      delay={`${0.56 + index * 0.06}s`}
                    >
                      {topic}
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="contact-form-box" delay="0.38s">
              <h2 className="head-sec text-center">Contact Form</h2>
              <p className="contact-form-copy">
                Fill out the Google Form below to share your requirement. If the
                form does not load, use the direct link to open it in a new tab.
              </p>
              <a
                href={googleFormUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary contact-submit"
                style={{ textDecoration: "none" }}
              >
                Open Google Form
              </a>
              <iframe
                title="Voltgrid contact form"
                src={googleFormEmbedUrl}
                className="contact-form-embed"
                loading="lazy"
                onLoad={handleFormEmbedLoad}
              >
                Loading…
              </iframe>
            </Reveal>
          </div>
        </RevealSection>
      </div>
    </main>
  );
}
