/** Public contact Google Form (submit / view form). */
export const GOOGLE_FORM_VIEW_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdk2Rk-MGz8gcAOvwbHqrNhlC_JxrXGOxeodFfGv5uHrnDFtQ/viewform?usp=pp_url'

/**
 * Google Form responses / records for the form owner.
 * Override with VITE_GOOGLE_FORM_RESPONSES_URL (edit link or linked Sheets URL) if needed.
 */
export const GOOGLE_FORM_RESPONSES_URL =
  (import.meta.env.VITE_GOOGLE_FORM_RESPONSES_URL || '').trim() ||
  'https://docs.google.com/forms/d/e/1FAIpQLSdk2Rk-MGz8gcAOvwbHqrNhlC_JxrXGOxeodFfGv5uHrnDFtQ/viewanalytics'
