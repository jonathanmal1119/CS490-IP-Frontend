const API_BASE_URL = 'http://localhost:4001/api'

async function http(path, init) {
  const url = `${API_BASE_URL}${path}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  }

  const response = await fetch(url, config)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Request failed')
  }

  return result.data
}

export const api = {
  // Films
  getTopRentedFilms: (limit = 5) => http(`/films/top?limit=${limit}`),
}
