import React from 'react'

export default function ImageLightbox({ src, alt, onClose }){
  if(!src) return null

  function handleBackdropClick(e){
    if(e.target === e.currentTarget) onClose()
  }

  return (
    <div className="image-lightbox-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="image-lightbox">
        <button type="button" className="image-lightbox-close" onClick={onClose} aria-label="Close image preview">
          ×
        </button>
        <img src={src} alt={alt || 'Profile photo preview'} className="image-lightbox-img" />
      </div>
    </div>
  )
}
