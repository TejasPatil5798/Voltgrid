import React, { useEffect, useState } from 'react'

export default function Home(){
  const slides = [
    {
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      alt: 'Training session 1'
    },
    {
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      alt: 'Training session 2'
    },
    {
      src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      alt: 'Training session 3'
    }
  ]

  const [current, setCurrent] = useState(0)

  useEffect(()=>{
    const id = setInterval(()=>{
      setCurrent(c => (c + 1) % slides.length)
    }, 4000)
    return () => clearInterval(id)
  },[])

  return (
    <main>
      <section className="slider">
        {slides.map((s, i) => (
          <div key={s.src} className={"slide" + (i === current ? ' active' : '')}>
            <img src={s.src + '?auto=format&fit=crop&w=1600&q=80'} alt={s.alt} loading="lazy" />
            <div className="overlay">
              <h1 style={{color:'white'}}>Capacity Building and Professional Training Across <br/>Technical, Operational, and Management Domains</h1>
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
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40" alt="Institutional Training" />
          </div>
          <div className="institution-content">
            <span className="section-tag">Institutional Positioning</span>
            <h2>Structured Professional Training for Technical, Operational and Managerial Excellence</h2>
            <p>The institute delivers structured training programs designed to enhance technical competencies, operational performance, safety compliance, and managerial effectiveness across multiple sectors.</p>
            <div className="highlight-box">
              <h3>Programs are developed based on:</h3>
              <ul style={{marginLeft:20}}>
                <li>Sector-specific operational requirements</li>
                <li>Applicable regulatory frameworks</li>
                <li>Industry and utility best practices</li>
              </ul>
            </div>
            <a href="/about" className="institution-btn">Read More</a>
          </div>
        </div>
      </section>

      <section className="program-domains">
        <div className="section-header">
          <h2>Program Domains</h2>
          <p>Structured professional training programs designed across technical, operational, compliance, and leadership domains for industry-ready capacity building.</p>
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
              <li>Leadership, team management, and organizational effectiveness</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="training-formats">
        <div className="section-header">
          <h2>Training Delivery Formats</h2>
          <p>Flexible delivery models designed to support different institutional, operational, and participant requirements.</p>
        </div>
        <div className="formats-grid">
          <div className="format-card">
            <div className="format-icon"><i className="fas fa-building"></i></div>
            <h3>On-site Training</h3>
            <p>Training delivered directly at client locations for operational convenience and contextual relevance.</p>
          </div>
          <div className="format-card">
            <div className="format-icon"><i className="fas fa-users"></i></div>
            <h3>Centralized Programs</h3>
            <p>Participants attend organized training sessions at designated institute or centralized venues.</p>
          </div>
          <div className="format-card">
            <div className="format-icon"><i className="fas fa-hotel"></i></div>
            <h3>Residential Programs</h3>
            <p>Structured immersive programs designed for continuous learning, extended engagement, and focused delivery subject to program design and facility availability.</p>
          </div>
        </div>
        <div className="format-note">
          <p>Residential programs are conducted to enable continuous learning, deeper participant engagement, and uninterrupted training effectiveness depending on facility readiness and program requirements.</p>
        </div>
      </section>

      <section className="program-structure">
        <div className="section-header">
          <h2>Program Structure</h2>
          <p>Structured training modules designed to ensure competency development, practical relevance, and organizational adaptability.</p>
        </div>
        <div className="structure-grid">
          <div className="structure-card">
            <h3>Duration</h3>
            <p>Typically 3–5 days per program depending on subject scope and participant level.</p>
          </div>
          <div className="structure-card">
            <h3>Format</h3>
            <p>Modular, competency-based learning framework for structured progression.</p>
          </div>
          <div className="structure-card">
            <h3>Delivery</h3>
            <p>Instructor-led sessions supported by case-based discussion, simulations, and practical application modules.</p>
          </div>
          <div className="structure-card">
            <h3>Customization</h3>
            <p>Available according to sector-specific and organizational requirements.</p>
          </div>
        </div>
      </section>

      <section className="key-outcomes">
        <div className="section-header">
          <h2>Key Outcomes</h2>
          <p>Expected institutional and operational impact from structured training interventions.</p>
        </div>
        <div className="outcomes-grid">
          <div className="outcome-box"><i className="fas fa-chart-line"></i><h3>Operational Performance</h3><p>Improvement in operational performance and execution capability.</p></div>
          <div className="outcome-box"><i className="fas fa-check-circle"></i><h3>Compliance Adherence</h3><p>Increased adherence to procedures and compliance requirements.</p></div>
          <div className="outcome-box"><i className="fas fa-shield-alt"></i><h3>Risk Reduction</h3><p>Reduction in operational and safety-related risks.</p></div>
          <div className="outcome-box"><i className="fas fa-user-cog"></i><h3>Capability Enhancement</h3><p>Enhanced capability in technical and managerial functions.</p></div>
        </div>
      </section>
    </main>
  )
}
