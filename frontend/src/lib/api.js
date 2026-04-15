const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()

export function apiUrl(path) {
  if (!path.startsWith('/')) path = `/${path}`
  return rawBaseUrl ? `${rawBaseUrl}${path}` : path
}
