import { createPortal } from 'react-dom'

/** Render modals on document.body so they sit above the dashboard portal/sidebar. */
export default function ModalPortal({ children }) {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}
