
import { useState } from 'react'

function ReportForm() {
    const [species, setSpecies] = useState('')
    const [date, setDate] = useState('')
    const [location, setLocation] = useState('')

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        setLoading(true)
        setMessage('')
        setError('')

        try {
            const response = await fetch('http://127.0.0.1:5000/api/reports', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                species,
                date,
                location
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit report')
            }

            setMessage(data.message)
            setSpecies('')
            setDate('')
            setLocation('')
            } catch (error) {
            setError(error.message)
            } finally {
            setLoading(false)
            }
        }

    return (
        <section className="report-section">
        <h2>Report a Tick Sighting</h2>
        <p>Help us monitor tick activity across the UK.</p>

        <form onSubmit={handleSubmit}>
            <label>
            Tick species
            <input
                type="text"
                value={species}
                onChange={event => setSpecies(event.target.value)}
                placeholder="e.g. Ixodes ricinus"
                required
            />
            </label>

            <label>
            Date observed
            <input
                type="date"
                value={date}
                onChange={event => setDate(event.target.value)}
                required
            />
            </label>

            <label>
            Location
            <input
                type="text"
                value={location}
                onChange={event => setLocation(event.target.value)}
                placeholder="e.g. Liverpool"
                required
            />
            </label>

            <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
            </button>

            {message && <p className="success-message" aria-live="polite">{message}</p>}
            {error && <p className="error-message" role="alert">{error}</p>}
        </form>
        </section>
    )

}

export default ReportForm
