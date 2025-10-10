import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()

  const loadCustomers = async (page = 1, search = '') => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getCustomers(page, 20, search)
      setCustomers(data.customers)
      setPagination(data.pagination)
      setCurrentPage(page)
    } catch (e) {
      setError(e?.message || 'Failed to load customers')
      console.error('Error loading customers:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers(1, searchTerm)
  }, [searchTerm])

  const goBack = () => {
    navigate('/')
  }

  const handlePageChange = (page) => {
    loadCustomers(page, searchTerm)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1)
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleEditCustomer = (customerId) => {
    navigate(`/customer/${customerId}/edit`)
  }

  const handleViewHistory = (customerId) => {
    navigate(`/customer/${customerId}/rental-history`)
  }

  const handleAddCustomer = () => {
    navigate('/customers/add')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading customers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
        <button onClick={goBack} className="back-button">Go Back</button>
      </div>
    )
  }

  return (
    <main className="main-content">
      <div className="customers-page">
        <div className="customers-header">
          <div className="customers-title-section">
            <h2>Customers</h2>
            <button onClick={handleAddCustomer} className="add-customer-button">
              + Add Customer
            </button>
          </div>
          <p className="customers-count">
            Showing {customers.length} of {pagination.totalCustomers} customers
            {searchTerm && (
              <span className="search-indicator"> (filtered by "{searchTerm}")</span>
            )}
          </p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search by customer ID, first name, or last name..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="clear-search-button"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="customers-table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
                <th>District/State</th>
                <th>Country</th>
                <th>Status</th>
                <th>Member Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="customer-row">
                  <td>{customer.id}</td>
                  <td className="customer-name">
                    {customer.first_name} {customer.last_name}
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>{customer.address}</td>
                  <td>{customer.city}</td>
                  <td>{customer.district}</td>
                  <td>{customer.country}</td>
                  <td>
                    <span className={`status-badge ${customer.active ? 'active' : 'inactive'}`}>
                      {customer.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(customer.create_date)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditCustomer(customer.id)}
                        className="edit-customer-button"
                        title="Edit Customer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewHistory(customer.id)}
                        className="view-history-button-small"
                        title="View Rental History"
                      >
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default CustomersPage

