
import {useState, useEffect} from 'react'
import './App.css'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import Education from './Education'
import TickMap from './TickMap'
import ReportForm from './ReportForm'





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

    const topSpecies = Object.entries(statistics.species).sort((a,b) => b[1] - a[1])[0]
    const topMonth = Object.entries(statistics.month).sort((a, b) => b[1] - a[1])[0]

    const monthlyData = Object.entries(statistics.month)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({
      month,
      sightings: count
    }))


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
          
          <article className="stat-card">
            <h3>Most reported species</h3>
            <p className="stat-value">
              {topSpecies ? topSpecies[0] : 'Loading...'}
            </p>
            {topSpecies && <p>{topSpecies[1]} sightings</p>}
          </article>
          
          <article className="stat-card">
            <h3>Busiest month</h3>
            <p className="stat-value">
              {topMonth ? topMonth[0] : 'Loading...'}
            </p>
            {topMonth && <p>{topMonth[1]} sightings</p>}
          </article>


        </div>
      </section>
      
      <section className="chart-section">
        <h2>Seasonal Tick Activity</h2>
        <p>Explore how reported sightings change over time.</p>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sightings"
                stroke="#0072ce"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <TickMap
          sightingsByLocation={statistics.location}
          sightings={sightings}
        />
      </section>

      <section>
        <ReportForm />
      </section>

      <section>
        <Education />
      </section>

      <section>
            <h2>Recent Sightings</h2>

            {loading && <p>Loading sightings...</p>}

            {error && <p>Error: {error}</p>}

            {!loading && !error && (
              
              <div className="sightings-grid">
                {[...sightings]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map(sighting => (
                  <article className="sighting-card" key={sighting.id}>
                    <div className="card-top">
                      <span className="species-label">Tick sighting</span>
                    </div>

                    <h3>{sighting.species}</h3>

                    <p className="sighting-location">
                      <span aria-hidden="true">📍</span> {sighting.location}
                    </p>

                    <p className="sighting-date">
                      <span aria-hidden="true">📅</span>{' '}
                      {new Date(sighting.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
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
