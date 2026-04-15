import React from 'react'

export default function ExpertCard({ expert, onRegister, onPhotoClick }){
  const photo = expert.profilePhotoUrl || expert.photo || '/experts/default.jpg'
  return (
    <div className="card expert-card">
      <div className="expert-card-inner">
        <button
          type="button"
          className="expert-photo-button"
          onClick={() => onPhotoClick?.(photo, expert.name)}
          aria-label={`Open photo of ${expert.name}`}
        >
          <img className="expert-photo" src={photo} alt={expert.name} />
        </button>
        <div className="card-body">
          <h4>{expert.name}</h4>
          {expert.title && <div className="expert-role">{expert.title}</div>}
          {expert.yearsExperience ? <div className="muted">{expert.yearsExperience} yrs</div> : null}
          {expert.keySpecialisation && <div style={{marginTop:6}}><strong>Specialisation:</strong> {expert.keySpecialisation}</div>}
          {expert.profileSummary && <p className="expert-focus">{expert.profileSummary}</p>}
          {expert.domains?.length ? (
            <div className="expert-tags">
              {expert.domains.map((domain) => (
                <span key={domain} className="expert-tag">{domain}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
