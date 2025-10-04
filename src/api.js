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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server.')
    }
    throw error
  }
}

export const api = {
  getTopRentedFilms: (limit = 5) => http(`/films/top?limit=${limit}`),
  getTopActors: (limit = 5) => http(`/actors/top?limit=${limit}`),
  getFilmDetails: (id) => http(`/films/${id}`),
  getActorDetails: (id) => http(`/actors/${id}`),
  getCustomers: (page = 1, limit = 20, search = '') => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    return http(`/customers?page=${page}&limit=${limit}${searchParam}`);
  },
  searchFilms: (query, type) => http(`/films/search?query=${encodeURIComponent(query)}&type=${type}`),
  getRecentFilms: (limit = 15) => http(`/films/recent?limit=${limit}`),
}
