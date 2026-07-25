import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <span className="section-tag">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="legal-lead">
          This Privacy Policy explains how Voltgrid Insights collects, uses, and
          protects information when you use our website and learning portals.
        </p>
        <p className="legal-updated">Last updated: July 25, 2026</p>

        <article className="legal-section">
          <h2>1. Information we collect</h2>
          <p>We may collect:</p>
          <ul>
            <li>Account details such as name, email address, and role</li>
            <li>Contact form submissions and enquiry messages</li>
            <li>Learning activity needed to run courses, batches, and messaging</li>
            <li>Basic site usage data such as visit counts for service improvement</li>
          </ul>
        </article>

        <article className="legal-section">
          <h2>2. How we use information</h2>
          <p>We use information to:</p>
          <ul>
            <li>Provide access to admin, tutor, and learner dashboards</li>
            <li>Respond to contact requests and partnership enquiries</li>
            <li>Deliver training, scheduling, and messaging features</li>
            <li>Improve website performance, security, and content</li>
          </ul>
        </article>

        <article className="legal-section">
          <h2>3. Sharing of information</h2>
          <p>
            We do not sell personal information. Information may be shared only
            with trusted service providers who help us operate the platform
            (for example hosting or email delivery), or when required by law.
          </p>
        </article>

        <article className="legal-section">
          <h2>4. Data security</h2>
          <p>
            We take reasonable technical and organizational measures to protect
            account and enquiry data. No method of transmission or storage is
            completely secure, so we encourage strong passwords and careful
            account use.
          </p>
        </article>

        <article className="legal-section">
          <h2>5. Your choices</h2>
          <p>
            You may request updates to your account profile through the portal.
            For privacy questions or deletion requests related to contact
            submissions, email{" "}
            <a href="mailto:contact@voltgridinsights.com">
              contact@voltgridinsights.com
            </a>
            .
          </p>
        </article>

        <article className="legal-section">
          <h2>6. Contact</h2>
          <p>
            Voltgrid Insights
            <br />
            VASWANI CHAMBERS, WORLI, MUMBAI, MAHARASHTRA-400030
            <br />
            Email:{" "}
            <a href="mailto:contact@voltgridinsights.com">
              contact@voltgridinsights.com
            </a>
          </p>
        </article>

        <p className="legal-back">
          <Link to="/">← Back to Home</Link>
        </p>
      </section>
    </main>
  );
}
