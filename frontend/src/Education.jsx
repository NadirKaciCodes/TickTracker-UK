
function Education() {
    const species = [    
        {
        name: 'Ixodes ricinus',
        commonName: 'Castor bean tick',
        description:
            'A widespread UK tick species found in habitats such as woodland, grassland and heathland.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Ixodes_ricinus'
        },
        {
        name: 'Dermacentor reticulatus',
        commonName: 'Ornate cow tick',
        description:
            'A UK tick species associated with a range of habitats, including grassland.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Dermacentor_reticulatus'
        },
        {
        name: 'Ixodes hexagonus',
        commonName: 'Hedgehog tick',
        description:
            'A tick commonly associated with hedgehogs and other small mammals.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Ixodes_hexagonus'
        }
    ]

    const preventionTips = [
        'Wear long trousers and tuck them into socks when walking through vegetation.',
        'Use an appropriate insect repellent according to its label.',
        'Stick to paths where practical and avoid brushing against long vegetation.',
        'Check your skin, clothing and pets for ticks after spending time outdoors.',
        'Remove attached ticks promptly using a fine-tipped tick-removal tool.'
    ]

    return (
        <section className="education-section">
        <h2>Tick Education & Prevention</h2>
        <p>
            Learn about tick species and how to reduce your risk of tick bites.
        </p>

        <h3>Species guide</h3>
        <div className="species-grid">
            {species.map(tick => (
            <article className="education-card" key={tick.name}>
                <h4>{tick.commonName}</h4>
                <p><em>{tick.name}</em></p>
                <p>{tick.description}</p>
            <a
                className="wiki-link"
                href={tick.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                >
                Read more on Wikipedia ↗
            </a>
            </article>
            ))}
        </div>

        <h3>Preventing tick bites</h3>
        <ul className="prevention-list">
            {preventionTips.map(tip => (
            <li key={tip}>{tip}</li>
            ))}
        </ul>
        </section>
        )
}

export default Education
