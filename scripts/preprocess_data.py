#!/usr/bin/env python3
"""
Data Preprocessor for Road Accident Dataset
Cleans raw CSV data and prepares it for Hadoop/Hive/Spark ingestion.

Steps:
  1. Read raw accidents CSV (synthetic or US_Accidents)
  2. Drop rows with null City, State, Start_Lat, Start_Lng
  3. Remove duplicate IDs
  4. Filter invalid coordinates
  5. Add Severity_Label column (1-2=Minor, 3=Moderate, 4=Severe)
  6. Add Hour, Month, Year, Day_of_Week from Start_Time
  7. Save cleaned CSV to datasets/processed/accidents_clean.csv
  8. Print validation report
"""

import csv
import os
import sys
from datetime import datetime
from collections import Counter

# ── Configuration ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_CSV   = os.path.join(BASE_DIR, "datasets", "raw", "synthetic_accidents.csv")
OUT_CSV   = os.path.join(BASE_DIR, "datasets", "processed", "accidents_clean.csv")

# Allow override via env vars for flexibility
RAW_CSV = os.environ.get("ACCIDENTS_RAW_CSV", RAW_CSV)
OUT_CSV = os.environ.get("ACCIDENTS_CLEAN_CSV", OUT_CSV)

REQUIRED_COLS = {"ID", "City", "State", "Start_Lat", "Start_Lng", "Severity", "Start_Time"}


def severity_label(sev: int) -> str:
    """Map numeric severity to human-readable label."""
    if sev <= 2:
        return "Minor"
    elif sev == 3:
        return "Moderate"
    else:
        return "Severe"


def parse_datetime(dt_str: str):
    """Parse Start_Time string; return datetime or None."""
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(dt_str.strip(), fmt)
        except ValueError:
            continue
    return None


def is_valid_coord(lat_str: str, lng_str: str) -> bool:
    """Return True if lat/lng strings parse to valid WGS-84 coordinates."""
    try:
        lat = float(lat_str)
        lng = float(lng_str)
        return -90 <= lat <= 90 and -180 <= lng <= 180
    except (ValueError, TypeError):
        return False


def main():
    print("=" * 60)
    print("ROAD ACCIDENT DATA PREPROCESSOR")
    print("=" * 60)

    # ── Validate input file ────────────────────────────────────────
    if not os.path.exists(RAW_CSV):
        print(f"[ERROR] Raw CSV not found: {RAW_CSV}")
        print("  Run: python datasets/synthetic/generate_synthetic.py first")
        sys.exit(1)

    os.makedirs(os.path.dirname(OUT_CSV), exist_ok=True)

    total_raw       = 0
    total_cleaned   = 0
    dropped_null    = 0
    dropped_dup     = 0
    dropped_coord   = 0
    dropped_time    = 0
    seen_ids        = set()
    severity_counts = Counter()

    # Collect additional output columns beyond what's in raw
    extra_cols = ["Severity_Label", "Hour", "Month", "Year", "Day_of_Week"]

    with open(RAW_CSV, newline="", encoding="utf-8") as in_f:
        reader = csv.DictReader(in_f)
        raw_fieldnames = reader.fieldnames or []

        # Validate required columns exist
        missing = REQUIRED_COLS - set(raw_fieldnames)
        if missing:
            print(f"[WARNING] Missing columns in raw CSV: {missing}")
            print("  Proceeding with available columns.")

        out_fieldnames = raw_fieldnames + [c for c in extra_cols if c not in raw_fieldnames]

        with open(OUT_CSV, "w", newline="", encoding="utf-8") as out_f:
            writer = csv.DictWriter(out_f, fieldnames=out_fieldnames)
            writer.writeheader()

            for row in reader:
                total_raw += 1

                # 1. Drop nulls in critical columns
                if not row.get("City") or not row.get("State") or \
                   not row.get("Start_Lat") or not row.get("Start_Lng"):
                    dropped_null += 1
                    continue

                # 2. Remove duplicates by ID
                rec_id = row.get("ID", "").strip()
                if rec_id in seen_ids:
                    dropped_dup += 1
                    continue
                seen_ids.add(rec_id)

                # 3. Filter invalid coordinates
                if not is_valid_coord(row["Start_Lat"], row["Start_Lng"]):
                    dropped_coord += 1
                    continue

                # 4. Parse Start_Time
                dt = parse_datetime(row.get("Start_Time", ""))
                if dt is None:
                    dropped_time += 1
                    continue

                # 5. Add Severity_Label
                try:
                    sev = int(float(row.get("Severity", 1)))
                except (ValueError, TypeError):
                    sev = 1
                row["Severity_Label"] = severity_label(sev)
                severity_counts[row["Severity_Label"]] += 1

                # 6. Add temporal columns
                row["Hour"]        = dt.hour
                row["Month"]       = dt.month
                row["Year"]        = dt.year
                row["Day_of_Week"] = dt.strftime("%A")

                writer.writerow(row)
                total_cleaned += 1

    total_dropped = total_raw - total_cleaned

    # ── Validation Report ──────────────────────────────────────────
    print(f"\n{'─'*60}")
    print("VALIDATION REPORT")
    print(f"{'─'*60}")
    print(f"  Total raw records     : {total_raw:>10,}")
    print(f"  Total cleaned records : {total_cleaned:>10,}")
    print(f"  Total dropped records : {total_dropped:>10,}")
    print(f"    ↳ Dropped (null)    : {dropped_null:>10,}")
    print(f"    ↳ Dropped (dup ID)  : {dropped_dup:>10,}")
    print(f"    ↳ Dropped (coord)   : {dropped_coord:>10,}")
    print(f"    ↳ Dropped (bad time): {dropped_time:>10,}")
    print(f"\nSeverity Breakdown:")
    for label in ["Minor", "Moderate", "Severe"]:
        cnt = severity_counts.get(label, 0)
        pct = (cnt / total_cleaned * 100) if total_cleaned else 0
        print(f"  {label:<10}: {cnt:>8,}  ({pct:.1f}%)")
    print(f"\nOutput saved to: {OUT_CSV}")
    print("=" * 60)


if __name__ == "__main__":
    main()
