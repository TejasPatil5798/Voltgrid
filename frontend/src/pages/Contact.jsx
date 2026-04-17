import React from "react";
import contactHeroImage from "../assets/images/contact-hero.jpeg";

const contactCards = [
  {
    title: "Voltgrid Insights",
    text: "Professional training and capability-building platform for technical, operational, and compliance-focused learning.",
  },
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

export default function Contact() {
  return (
    <main>
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

      <section className="contact-page">
        <div className="section-header contact-header">
          <h2>We’d Be Glad to Support Your Training Requirement</h2>
          <p>
            Share your requirement and we will connect your enquiry to the most
            relevant program area, learning format, or engagement track.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
            <div className="contact-card-grid">
              {contactCards.map((card) => (
                <div key={card.title} className="contact-card">
                  <h3 className="head-sec">{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>

            <div className="contact-highlight-panel">
              <h3>How We Can Help</h3>
              <div className="contact-topic-grid">
                {enquiryTopics.map((topic) => (
                  <div key={topic} className="contact-topic-card">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-box">
            <h2 className="head-sec">Contact Form</h2>
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
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
