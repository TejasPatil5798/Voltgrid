import React from 'react'
import { Search } from 'lucide-react'

export default function SearchLearnerInput({ id, value, onChange, placeholder }) {
  return (
    <div className="dash-batch-search-input">
      <Search size={16} aria-hidden="true" />
      <input
        id={id}
        type="search"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
