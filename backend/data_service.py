
import requests

BASE_URL = "https://dev-task.elancoapps.com/data"


def fetch_sightings():
    url = f"{BASE_URL}/tick-sightings"

    response = requests.get(url, timeout=15)
    response.raise_for_status()

    sightings = response.json()

    if not isinstance(sightings, list):
        raise ValueError("Unexpected API response: expected a list")

    return sightings

def filter_sightings(sightings, location=None, start_date=None, end_date=None):
    filtered_sightings = []

    if location is not None:
        location = location.lower()

    for s in sightings:
        if location is not None and s["location"].lower() != location:
            continue

        if start_date is not None and s["date"][:10] < start_date:
            continue

        if end_date is not None and s["date"][:10] > end_date:
            continue

        filtered_sightings.append(s)

    return filtered_sightings




    
    
# unfiltered = filter_sightings(fetch_sightings())
# filtered_by_place = filter_sightings(fetch_sightings(), "london")
# filtered_by_st_date = filter_sightings(fetch_sightings(), "london", "2017-04-23")
# filtered_by_ed_date = filter_sightings(fetch_sightings(), "london", "2017-04-23", "2022-08-01")

# print(len(unfiltered), len(filtered_by_place), len(filtered_by_st_date), len(filtered_by_ed_date))

def count_by_location (sightings):
    location_count = {}

    for s in sightings :
        if s["location"] not in location_count :
            location_count[s["location"]] = 1
        else :
            location_count[s["location"]] += 1

    return location_count

def count_by_species (sightings):
    species_count = {}

    for s in sightings :
        if s["species"] not in species_count :
            species_count[s["species"]] = 1
        else :
            species_count[s["species"]] += 1

    return species_count

def count_sightings(sightings):
    num_of_sightings = len(sightings)
    return num_of_sightings


def count_by_month(sightings):
    month_count = {}
    for s in sightings :
        month = s["date"][:7]
        if month not in month_count :
            month_count[month] = 1
        else :
            month_count[month] += 1

    return month_count


