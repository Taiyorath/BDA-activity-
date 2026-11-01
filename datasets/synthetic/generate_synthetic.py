#!/usr/bin/env python3
"""
Synthetic Road Accident Dataset Generator
CLEARLY LABELLED SYNTHETIC DATA - not real accident statistics
"""
import csv, random, argparse, math
from datetime import datetime, timedelta

CITIES = [
    ("Los Angeles", "CA", 34.0522, -118.2437),
    ("Houston", "TX", 29.7604, -95.3698),
    ("Phoenix", "AZ", 33.4484, -112.0740),
    ("Philadelphia", "PA", 39.9526, -75.1652),
    ("San Antonio", "TX", 29.4241, -98.4936),
    ("San Diego", "CA", 32.7157, -117.1611),
    ("Dallas", "TX", 32.7767, -96.7970),
    ("San Jose", "CA", 37.3382, -121.8863),
    ("Austin", "TX", 30.2672, -97.7431),
    ("Jacksonville", "FL", 30.3322, -81.6557),
    ("Fort Worth", "TX", 32.7555, -97.3308),
    ("Columbus", "OH", 39.9612, -82.9988),
    ("Charlotte", "NC", 35.2271, -80.8431),
    ("Indianapolis", "IN", 39.7684, -86.1581),
    ("San Francisco", "CA", 37.7749, -122.4194),
    ("Seattle", "WA", 47.6062, -122.3321),
    ("Denver", "CO", 39.7392, -104.9903),
    ("Nashville", "TN", 36.1627, -86.7816),
    ("Oklahoma City", "OK", 35.4676, -97.5164),
    ("El Paso", "TX", 31.7619, -106.4850),
    ("Chicago", "IL", 41.8781, -87.6298),
    ("New York", "NY", 40.7128, -74.0060),
    ("Miami", "FL", 25.7617, -80.1918),
    ("Atlanta", "GA", 33.7490, -84.3880),
    ("Boston", "MA", 42.3601, -71.0589),
    ("Detroit", "MI", 42.3314, -83.0458),
    ("Las Vegas", "NV", 36.1699, -115.1398),
    ("Memphis", "TN", 35.1495, -90.0490),
    ("Portland", "OR", 45.5051, -122.6750),
    ("Baltimore", "MD", 39.2904, -76.6122),
]

WEATHER = [
    "Clear", "Clear", "Clear", "Partly Cloudy", "Partly Cloudy",
    "Overcast", "Rain", "Rain", "Heavy Rain", "Fog",
    "Light Snow", "Snow", "Thunderstorm", "Windy", "Haze",
    "Drizzle", "Mist", "Smoke", "Sand", "Blowing Snow"
]

ROAD_CONDITIONS = [
    "Dry", "Dry", "Dry", "Wet", "Wet",
    "Icy", "Snow Covered", "Loose Gravel", "Oil Slick", "Flooded"
]

ROAD_TYPES = [
    "Interstate", "US Highway", "State Route", "City Street",
    "Arterial Road", "Expressway", "Freeway", "Boulevard", "Avenue"
]

def gen_record(idx, start_date):
    city, state, base_lat, base_lng = random.choice(CITIES)
    # Add small random offset so accidents cluster near city centres
    lat = base_lat + random.gauss(0, 0.05)
    lng = base_lng + random.gauss(0, 0.05)
    # Some engineered black-spot clusters
    if random.random() < 0.15:
        lat = base_lat + random.gauss(0, 0.008)
        lng = base_lng + random.gauss(0, 0.008)

    days_offset = random.randint(0, 365 * 7)
    accident_dt = start_date + timedelta(days=days_offset,
                                         hours=random.randint(0, 23),
                                         minutes=random.randint(0, 59))

    # Higher severity for night hours, bad weather
    hour = accident_dt.hour
    weather = random.choice(WEATHER)
    road_cond = random.choice(ROAD_CONDITIONS)

    base_sev = 1
    if hour < 6 or hour > 21:
        base_sev += 1
    if weather in ("Rain", "Heavy Rain", "Fog", "Snow", "Thunderstorm", "Blowing Snow"):
        base_sev += 1
    if road_cond in ("Icy", "Flooded", "Oil Slick"):
        base_sev += 1
    severity = min(4, max(1, base_sev + random.randint(-1, 1)))

    temp = round(random.gauss(60, 20), 1)  # Fahrenheit
    visibility = round(max(0.1, random.gauss(9, 3)), 1)
    wind_speed = round(max(0, random.gauss(10, 5)), 1)
    humidity = round(random.uniform(20, 100), 1)

    return {
        "ID": f"SYN-{idx:08d}",
        "Source": "SYNTHETIC",
        "Severity": severity,
        "Start_Time": accident_dt.strftime("%Y-%m-%d %H:%M:%S"),
        "End_Time": (accident_dt + timedelta(minutes=random.randint(5, 120))).strftime("%Y-%m-%d %H:%M:%S"),
        "Start_Lat": round(lat, 6),
        "Start_Lng": round(lng, 6),
        "Distance(mi)": round(random.uniform(0.01, 5.0), 2),
        "Description": f"Accident on {random.choice(ROAD_TYPES)}",
        "Street": f"{random.randint(1, 999)} {random.choice(['Main St', 'Oak Ave', 'Maple Rd', 'Broadway', 'Park Blvd'])}",
        "City": city,
        "County": f"{city} County",
        "State": state,
        "Zipcode": f"{random.randint(10000, 99999)}",
        "Country": "US",
        "Timezone": "US/Eastern",
        "Airport_Code": f"K{state}{random.randint(10,99)}",
        "Weather_Timestamp": accident_dt.strftime("%Y-%m-%d %H:%M:%S"),
        "Temperature(F)": temp,
        "Wind_Chill(F)": round(temp - random.uniform(0, 15), 1),
        "Humidity(%)": humidity,
        "Pressure(in)": round(random.uniform(28, 32), 2),
        "Visibility(mi)": visibility,
        "Wind_Direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
        "Wind_Speed(mph)": wind_speed,
        "Precipitation(in)": round(random.uniform(0, 2), 2) if weather in ("Rain", "Heavy Rain", "Drizzle") else 0.0,
        "Weather_Condition": weather,
        "Amenity": random.choice([True, False]),
        "Bump": random.choice([True, False]),
        "Crossing": random.choice([True, False]),
        "Give_Way": random.choice([True, False]),
        "Junction": random.choice([True, False]),
        "No_Exit": False,
        "Railway": False,
        "Roundabout": random.choice([True, False]),
        "Station": False,
        "Stop": random.choice([True, False]),
        "Traffic_Calming": False,
        "Traffic_Signal": random.choice([True, False]),
        "Turning_Loop": False,
        "Sunrise_Sunset": "Night" if (hour < 6 or hour > 20) else "Day",
        "Civil_Twilight": "Night" if (hour < 7 or hour > 19) else "Day",
        "Nautical_Twilight": "Night" if (hour < 7 or hour > 19) else "Day",
        "Astronomical_Twilight": "Night" if (hour < 7 or hour > 19) else "Day",
        "Road_Condition": road_cond,
    }

def main():
    parser = argparse.ArgumentParser(description="Generate synthetic road accident data")
    parser.add_argument("--records", type=int, default=100000, help="Number of records")
    parser.add_argument("--output", type=str, default="datasets/raw/synthetic_accidents.csv")
    args = parser.parse_args()

    print(f"[SYNTHETIC DATA GENERATOR] Generating {args.records:,} records...")
    print("WARNING: This is SYNTHETIC data, NOT real accident statistics.")

    start_date = datetime(2016, 1, 1)
    record = gen_record(0, start_date)
    fieldnames = list(record.keys())

    import os
    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    with open(args.output, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(args.records):
            writer.writerow(gen_record(i, start_date))
            if (i + 1) % 10000 == 0:
                print(f"  Generated {i+1:,} / {args.records:,} records...")

    print(f"[DONE] Saved to {args.output}")

if __name__ == "__main__":
    main()
