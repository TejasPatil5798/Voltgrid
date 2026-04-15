import React, { useEffect, useState } from 'react'
import ExpertCard from '../components/ExpertCard'
import RegisterModal from '../components/RegisterModal'
import ImageLightbox from '../components/ImageLightbox'
import { apiUrl } from '../lib/api'

const domainBlocks = [
  {
    title: 'Technical & Engineering Systems',
    points: [
      'Infrastructure and utility systems',
      'Equipment engineering and operations',
      'Monitoring and control systems',
      'Diagnostics and maintenance practices'
    ]
  },
  {
    title: 'Operations & System Management',
    points: [
      'System operations and coordination',
      'Monitoring platforms and decision-making tools',
      'Data-driven operational management'
    ]
  },
  {
    title: 'Safety & Compliance',
    points: [
      'Regulatory compliance frameworks',
      'Workplace safety systems',
      'Hazard identification and risk mitigation',
      'Incident investigation and corrective actions'
    ]
  },
  {
    title: 'Asset & Maintenance Management',
    points: [
      'Asset lifecycle management',
      'Preventive and condition-based maintenance',
      'Reliability-centered maintenance strategies'
    ]
  },
  {
    title: 'Project & Contract Management',
    points: [
      'Project planning and execution',
      'Contract administration and dispute management',
      'Stakeholder coordination'
    ]
  },
  {
    title: 'Regulatory, Financial & Leadership',
    points: [
      'Regulatory frameworks and compliance',
      'Financial management for technical professionals',
      'Leadership, team management, and organizational effectiveness'
    ]
  }
]

const capabilityHighlights = [
  'Programs aligned with operational requirements and industry practices',
  'Delivery support for government, PSU, utility, and industrial environments',
  'Modular 3-5 day formats with practical and scenario-based learning',
  'Focus on measurable outcomes, compliance adherence, and risk reduction'
]

export default function Experts(){
  const [experts, setExperts] = useState([])
  const [selectedExpert, setSelectedExpert] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch(apiUrl('/api/experts'))
        if(!res.ok) throw new Error('Failed to load experts')
        const data = await res.json()
        setExperts(data)
      }catch(e){
        setExperts(fallbackExperts)
      }
    }
    load()
  },[])

  function openRegister(expert = null){
    setSelectedExpert(expert)
    setShowRegister(true)
  }

  function openPreview(src, alt){
    setPreviewImage({ src, alt })
  }

  return (
    <main className="page-main container">
      <section className="experts-hero card">
        <span className="experts-kicker">Voltgrid Insights</span>
        <h1>Domain Experts and Program Leaders</h1>
        <p className="experts-lead">
          Capability-building programs are delivered by professionals with practical exposure across technical,
          operational, compliance, maintenance, and management environments.
        </p>
        <div className="experts-highlight-grid">
          {capabilityHighlights.map((item) => (
            <div key={item} className="experts-highlight-card">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="section-header experts-section-header">
        <h2>Expert Profiles</h2>
        <p>
          Faculty engagement is structured to support sector-relevant training delivery, practical applicability,
          and measurable learning outcomes.
        </p>
      </section>

      <div className="grid-list experts-grid">
        {experts.map(ex => (
          <div key={ex.id}>
            <ExpertCard expert={ex} onRegister={openRegister} onPhotoClick={openPreview} />
          </div>
        ))}
      </div>

      <section className="experts-domains-section">
        <div className="section-header experts-section-header">
          <h2>Training Domains Supported</h2>
          <p>
            Programs span technical, operational, safety, maintenance, project, regulatory, and leadership areas
            in line with the approved website content.
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

      <section className="experts-cta card">
        <div>
          <h2>Register Interest for a Program</h2>
          <p>
            Share your organization, participant profile, or learning requirement and we will align the enquiry
            with the relevant domain expert or training track.
          </p>
        </div>
        <button className="btn btn-danger" onClick={()=>openRegister()}>
          Register / Enquire
        </button>
      </section>

      {showRegister && <RegisterModal expert={selectedExpert} onClose={() => setShowRegister(false)} />}
      {previewImage && (
        <ImageLightbox
          src={previewImage.src}
          alt={previewImage.alt}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  )
}
