const API_BASE_URL = 'http://localhost:4001/api'

async function http(path, init) {
  const url = `${API_BASE_URL}${path}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    ...init,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Request failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    // Handle network errors, CORS errors, etc.
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:4001')
    }
    throw error
  }
}

export const api = {
  // Films
  getTopRentedFilms: (limit = 5) => http(`/films/top?limit=${limit}`),
}
