import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-box">
          <h2>VoltGrid Insights</h2>
          <p>
            Professional training and capability-building platform for
            technical, operational, and compliance-focused learning.
          </p>
        </div>
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/programs">Training Programs</a>
            </li>
            <li>
              <a href="/safety">Safety & Compliance</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-box">
          <h3>Contact Info</h3>
          <p>
            Email:{" "}
            <a href="mailto:contact@voltgridinsights.com">
              contact@voltgridinsights.com
            </a>
          </p>
          <p>
            Phone: <a href="tel:9607700480">9607700480</a>
          </p>
          <p>
            VASWANI CHAMBERS,
            <br />
            WORLI, MUMBAI,
            <br />
            MAHARASHTRA-400030
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 VoltGrid | All Rights Reserved</p>
      </div>
    </footer>
  );
}
