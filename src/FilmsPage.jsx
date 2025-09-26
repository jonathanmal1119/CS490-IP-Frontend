import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function FilmsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('title')
  const [searchResults, setSearchResults] = useState([]) // For actual search results (flat array)
  const [filmCategoriesData, setFilmCategoriesData] = useState([]) // For Netflix-style categories
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Searching for:', searchQuery.trim(), 'Type:', searchType)
      const results = await api.searchFilms(searchQuery.trim(), searchType)
      console.log('Search results:', results)
      setSearchResults(Array.isArray(results) ? results : []) // Set searchResults (flat array)
    } catch (e) {
      console.error('Search error:', e)
      setError(e?.message || 'Search failed')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const viewFilmDetails = (filmId) => {
    navigate(`/film/${filmId}`, { state: { from: 'films' } })
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([]) // Clear search results
    setError(null)
    // filmCategoriesData remains, so the Netflix layout reappears
  }

  // Load recently released films on component mount
  useEffect(() => {
    const loadRecentFilms = async () => {
      try {
        console.log('Loading recently released films...')
        // Load recently released films using the new API endpoint
        const recentFilms = await api.getRecentFilms(15)
        
        console.log('Recent films loaded:', recentFilms)
        
        const categories = [
          { title: 'Recently Released Films', films: recentFilms || [] } // Ensure films is an array
        ].filter(category => category.films.length > 0)
        
        setFilmCategoriesData(categories) // Set the new state variable
      } catch (e) {
        console.error('Failed to load recent films:', e)
        setError('Failed to load recent films. Please try searching manually.')
      }
    }
    loadRecentFilms()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Sakila Film Database</h1>
          <nav className="header-nav">
            <button 
              className="nav-button" 
              onClick={() => navigate('/')}
            >
              Homepage
            </button>
            <button 
              className="nav-button active" 
              onClick={() => navigate('/films')}
            >
              Films
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="films-page-container">
          <section className="search-section">
            <h2>Search Films</h2>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-inputs">
                <select 
                  value={searchType} 
                  onChange={(e) => setSearchType(e.target.value)}
                  className="search-type-select"
                >
                  <option value="title">By Film Title</option>
                  <option value="actor">By Actor Name</option>
                  <option value="genre">By Genre</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${searchType === 'title' ? 'film titles' : searchType === 'actor' ? 'actor names' : 'genres'}...`}
                  className="search-input"
                />
                <button type="submit" className="search-button" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
                {(searchQuery || searchResults.length > 0) && (
                  <button type="button" onClick={clearSearch} className="clear-button">
                    Clear
                  </button>
                )}
              </div>
            </form>
          </section>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {searchQuery ? ( // If there's an active search query
            <section className="results-section">
              <h3>
                Search Results 
                {searchResults.length > 0 && (
                  <span className="results-count">({searchResults.length} found)</span>
                )}
              </h3>
              
              {searchResults.length === 0 ? (
                <div className="no-results">
                  No films found matching your search criteria.
                </div>
              ) : (
                <div className="cards-grid"> {/* Use cards-grid for search results */}
                  {searchResults.map((film) => (
                    <div key={film.id} className="card film-card">
                      <h3>{film.title}</h3>
                      <p className="genre">{film.genre}</p>
                      <p className="year">Released: {film.releaseYear}</p>
                      <p className="rating">Rating: {film.rating}</p>
                      <p className="length">Length: {film.length} minutes</p>
                      <p className="description">{film.description}</p>
                      <button 
                        className="view-details-btn" 
                        onClick={() => viewFilmDetails(film.id)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : ( // If no active search query, show Netflix-style categories
            <section className="results-section">
              <h3>Recently Released Films</h3>
              
              {filmCategoriesData.length === 0 ? (
                <div className="no-results">
                  No recent films available.
                </div>
              ) : (
                <div className="netflix-categories">
                  {filmCategoriesData.map((category) => ( // Iterate over filmCategoriesData
                    <div key={category.title} className="category-row">
                      <h4 className="category-title">{category.title}</h4>
                      <div className="horizontal-scroll">
                        <div className="films-row">
                          {category.films.map((film) => ( // This is line 191, now category.films should be an array
                            <div key={film.id} className="netflix-film-card" onClick={() => viewFilmDetails(film.id)}>
                              <div className="film-poster">
                                <h5 className="film-title">{film.title}</h5>
                                <p className="film-genre">{film.genre}</p>
                                <p className="film-year">{film.releaseYear}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
      </footer>
    </div>
  )
}

export default FilmsPage
