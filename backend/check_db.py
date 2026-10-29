
import sqlite3

connection = sqlite3.connect("sightings.db")
cursor = connection.cursor()

cursor.execute("SELECT * FROM reports")
rows = cursor.fetchall()

for row in rows:
    print(row)

connection.close()
