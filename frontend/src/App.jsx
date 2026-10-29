
import {useState, useEffect} from 'react'
import './App.css'





function App() {
    const [sightings, setSightings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [location, setLocation] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [statistics, setStatistics] = useState({
      total: null,
      location: {},
      species: {},
      month: {}
    })



    function loadSightings() {
        const params = new URLSearchParams()

        if (location.trim()) {
          params.append('location', location.trim())
        }

        if (startDate) {
          params.append('start_date', startDate)
        }

        if (endDate) {
          params.append('end_date', endDate)
        }

        setLoading(true)
        setError(null)

        fetch(`http://127.0.0.1:5000/api/sightings?${params.toString()}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch sightings')
            }
            return response.json()
          })
          .then(data => {
            setSightings(data)
            setLoading(false)
          })
          .catch(error => {
            setError(error.message)
            setLoading(false)
          })
    }

    
    async function loadStatistics() {
      try {
        const types = ['total', 'location', 'species', 'month']

        const results = await Promise.all(
          types.map(async type => {
            const response = await fetch(
              `http://127.0.0.1:5000/api/statistics?type=${type}`
            )

            if (!response.ok) {
              throw new Error(`Failed to fetch ${type} statistics`)
            }

            return [type, await response.json()]
          })
        )

        setStatistics(Object.fromEntries(results))
      } catch (error) {
        console.error('Statistics error:', error)
      }
    }


      useEffect(() => {
          loadSightings()
          loadStatistics()
        }, [])

    return (
      <div className="app">
        <header>
          <h1>TickSight UK</h1>
          <p>Explore tick sightings across the United Kingdom.</p>
        </header>

      <section className="filters">
        <h2>Filter Sightings</h2>

        <form onSubmit={event => {
          event.preventDefault()
          loadSightings()
        }}>
          <label>
            Location
            <input
              type="text"
              placeholder="e.g. Liverpool"
              value={location}
              onChange={event => setLocation(event.target.value)}
            />
          </label>

          <label>
            Start date
            <input
              type="date"
              value={startDate}
              onChange={event => setStartDate(event.target.value)}
            />
          </label>

          <label>
            End date
            <input
              type="date"
              value={endDate}
              onChange={event => setEndDate(event.target.value)}
            />
          </label>

          <div className="filter-actions">
            <button type="submit">Apply Filters</button>

            <button
              type="button"
              onClick={() => {
                setLocation('')
                setStartDate('')
                setEndDate('')

                setLoading(true)
                setError(null)

                fetch('http://127.0.0.1:5000/api/sightings')
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Failed to fetch sightings')
                    }
                    return response.json()
                  })
                  .then(data => {
                    setSightings(data)
                    setLoading(false)
                  })
                  .catch(error => {
                    setError(error.message)
                    setLoading(false)
                  })
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      <main>
        
      <section className="statistics-section">
        <h2>Sighting Statistics</h2>

        <div className="statistics-grid">
          <article className="stat-card">
            <h3>Total sightings</h3>
            <p className="stat-value">
              {statistics.total ?? 'Loading...'}
            </p>
          </article>

          <article className="stat-card">
            <h3>Locations recorded</h3>
            <p className="stat-value">
              {Object.keys(statistics.location).length}
            </p>
          </article>

          <article className="stat-card">
            <h3>Most reported location</h3>
            <p className="stat-value">
              {Object.keys(statistics.location).length > 0
                ? Object.entries(statistics.location).sort(
                    (a, b) => b[1] - a[1]
                  )[0][0]
                : 'Loading...'}
            </p>
          </article>
        </div>
      </section>
      <section>
            <h2>Recent Sightings</h2>

            {loading && <p>Loading sightings...</p>}

            {error && <p>Error: {error}</p>}

            {!loading && !error && (
              
              <div className="sightings-grid">
                {sightings.map(sighting => (
                  <article className="sighting-card" key={sighting.id}>
                    <div className="card-top">
                      <span className="species-label">Tick sighting</span>
                      <span className="sighting-id">#{sighting.id}</span>
                    </div>

                    <h3>{sighting.species}</h3>

                    <p className="sighting-location">
                      <span aria-hidden="true">📍</span> {sighting.location}
                    </p>

                    <p className="sighting-date">
                      <span aria-hidden="true">📅</span> {sighting.date}
                    </p>
                  </article>
                ))}
              </div>

            )}
          </section>
      </main>
    </div>
  )
}

export default App
