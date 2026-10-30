
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import cityCoordinates from './CityCoordinates'


function MapResizer() {
    const map = useMap()

    useEffect(() => {
        const timer = setTimeout(() => {
        map.invalidateSize()
        }, 200)

        return () => clearTimeout(timer)
    }, [map])

    return null
}

function TickMap({sightingsByLocation, sightings}) {
    const [selectedCity, setSelectedCity] = useState(null)
    const citySightings = selectedCity
        ? sightings
            .filter(sighting => sighting.location === selectedCity)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        : []
    
    const filteredLocationCounts = sightings.reduce((counts, sighting) => {
        counts[sighting.location] = (counts[sighting.location] || 0) + 1
        return counts
    }, {})

    const filteredTotal = Object.values(filteredLocationCounts)
    .reduce((total, count) => total + count, 0)
    
        useEffect(() => {
        if (selectedCity && !filteredLocationCounts[selectedCity]) {
            setSelectedCity(null)
        }
    }, [selectedCity, filteredLocationCounts])



    
    async function shareCity() {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCity)}`

        const shareData = {
            title: `Tick sightings in ${selectedCity}`,
            text: `Explore reported tick sightings in ${selectedCity}.`,
            url
        }

        try {
            if (navigator.share) {
            await navigator.share(shareData)
            } else {
            await navigator.clipboard.writeText(url)
            alert('Location link copied to clipboard!')
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
            console.error('Sharing failed:', error)
            }
        }
    }


    return (
        <section className="map-section">
        <h2>UK Tick Sightings Map</h2>
        <p>
            Explore reported tick sightings by city.
            Markers represent approximate city-centre locations.
        </p>

        <div className="map-container">
            <MapContainer
            center={[54.5, -3]}
            zoom={5}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            >
                <MapResizer />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {Object.entries(filteredLocationCounts).map(([city, count]) => {
                const coordinates = cityCoordinates[city]

                if (!coordinates) return null

                return (
                    <CircleMarker
                        key={city}
                        center={coordinates}
                        radius={Math.max(7, Math.min(20, count / 5))}
                        pathOptions={{
                            color: '#ffffff',
                            weight: 2,
                            fillColor: count >= 80 ? '#b91c1c' : count >= 65 ? '#e58a25' : '#16845b',
                            fillOpacity: 0.8
                        }}
                        eventHandlers={{
                            click: () => setSelectedCity(city)
                        }}
                        >
                        <Popup>
                            <strong>{city}</strong>
                            <br />
                            {count} recorded sightings
                            <br />
                            <small>Approximate city-centre location</small>
                        </Popup>
                        </CircleMarker>
                )
            })}

            </MapContainer>
            
            <div className="map-legend">
                <span><i className="legend-dot low"></i> Lower sightings</span>
                <span><i className="legend-dot medium"></i> Moderate sightings</span>
                <span><i className="legend-dot high"></i> Higher sightings</span>
            </div>
            
        </div>

            {selectedCity && (
            <div className="city-info-panel">
                <button
                className="close-panel"
                onClick={() => setSelectedCity(null)}
                >
                ✕
                </button>

                <h3>{selectedCity}</h3>

                <p>
                    <strong>
                        {filteredLocationCounts[selectedCity] || 0}
                    </strong> recorded sightings</p>
                <p>
                    {filteredTotal > 0
                        ? `${((filteredLocationCounts[selectedCity] / filteredTotal) * 100).toFixed(1)}% of filtered sightings`
                        : '0% of filtered sightings'}
                </p>
                
                <h4>Sighting Timeline</h4>

                {citySightings.length > 0 ? (
                <div className="city-timeline">
                    {citySightings.map(sighting => (
                    <div className="timeline-item" key={sighting.id}>
                        <span className="timeline-date">
                        {new Date(sighting.date).toLocaleDateString('en-GB')}
                        </span>

                        <span className="timeline-species">
                        {sighting.species}
                        </span>
                    </div>
                    ))}
                </div>
                ) : (
                <p>No sightings available for this city under the current filters.</p>
                )}

                
                <div className="city-actions">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedCity)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="city-action-button"
                    >
                        Get directions ↗
                    </a>

                    <button
                        className="city-action-button share-button"
                        onClick={shareCity}
                    >
                        Share location
                    </button>
                </div>


            </div>
            )}

        </section>
    )
}

export default TickMap
