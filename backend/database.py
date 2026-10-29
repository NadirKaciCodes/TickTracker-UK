import sqlite3

def init_db():
    connection = sqlite3.connect("sightings.db")

    connection.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            species TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()

def save_sighting(species, date, location):

    data = (species, date, location)
    connection = sqlite3.connect("sightings.db")

    connection.execute("""
        INSERT INTO reports (species, date, location)
        VALUES (?, ?, ?) 
    """,
    data)

    connection.commit()
    connection.close()

