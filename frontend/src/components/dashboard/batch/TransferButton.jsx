import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'

const LABELS = {
  add: 'Add to batch',
  remove: 'Remove from batch',
}

export default function TransferButton({ direction, onClick, disabled }) {
  const isAdd = direction === 'add'
  const Icon = isAdd ? ArrowLeftCircle : ArrowRightCircle

  return (
    <motion.button
      type="button"
      className={`dash-transfer-btn dash-transfer-btn--${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={LABELS[direction]}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon size={22} aria-hidden="true" />
    </motion.button>
  )
}
