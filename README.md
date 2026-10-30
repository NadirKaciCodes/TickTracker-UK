# TickSight UK

TickSight UK is a web application for exploring UK tick-sighting data. It provides an interactive map, statistics, filtering tools and educational information about tick species. Users can also submit their own tick-sighting reports, which are stored locally in an SQLite database.

## Features

- **Interactive map:** Explore tick sightings across UK cities using Leaflet.
- **Sightings dashboard:** View the total number of recorded sightings and breakdowns by location and species.
- **Filtering:** Filter sightings by location and date range.
- **Statistics and visualisations:** Explore monthly sighting trends and species distributions.
- **Latest sightings:** View the ten most recent records.
- **Submit a report:** Submit a tick sighting through the application. Reports are stored in a local SQLite database.
- **Educational information:** Learn about common UK tick species and prevention measures.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Mapping | Leaflet, React-Leaflet |
| Charts | Recharts |
| Backend | Python, Flask |
| HTTP requests | Requests |
| Database | SQLite |

## Project Structure

```text
TickTracker-UK/
├── backend/
│   ├── app.py
│   ├── data_service.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/NadirKaciCodes/TickTracker-UK.git
cd TickTracker-UK
```

### 2. Set up the backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Install the required packages:

```bash
python -m pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

The backend runs at:

`http://127.0.0.1:5000`

### 3. Set up the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, normally:

`http://localhost:5173`

Both the Flask backend and Vite frontend must be running for the application to function correctly.

## API Endpoints

The Flask backend provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks backend availability. |
| GET | `/api/sightings` | Retrieves tick sightings, with optional filters. |
| GET | `/api/statistics` | Retrieves statistics. |
| POST | `/api/reports` | Submits a new tick-sighting report. |

### Sightings filters

The `/api/sightings` endpoint supports:

- `location` – filters sightings by location.
- `start_date` – sets the earliest date.
- `end_date` – sets the latest date.

Example:

```text
/api/sightings?location=Manchester&start_date=2026-01-01&end_date=2026-12-31
```

### Statistics

The `/api/statistics` endpoint supports the following types:

- `total`
- `location`
- `species`
- `month`

Example:

```text
/api/statistics?type=species
```

### Report submission

The `/api/reports` endpoint accepts a JSON POST request containing:

```json
{
  "species": "Ixodes ricinus",
  "date": "2026-10-30",
  "location": "Manchester"
}
```

Successful submissions return HTTP status `201`. Invalid submissions return HTTP status `400`.

## Data and Mapping Notes

The application retrieves its original tick-sighting dataset from the Elanco development API.

The source dataset does not provide precise geographical coordinates for individual sightings. Consequently, map markers use approximate city-centre coordinates to represent sightings by city. They should not be interpreted as the exact locations where ticks were found.

User-submitted reports are stored separately in a local SQLite database and are not written back to the original Elanco API.

## Development

To build the frontend for production:

```bash
npm run build
```

To run the frontend lint checks:

```bash
npm run lint
```

## Author

Developed by **Nadir Kaci-Aissa** as a software engineering placement task.calhost:5173`.

## Author

Developed by **Nadir Kaci-Aissa** as part of a software engineering placement assessment for elanco.

GitHub: [NadirKaciCodes](https://github.com/NadirKaciCodes)
