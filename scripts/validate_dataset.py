#!/usr/bin/env python3
"""
Dataset Validation Script
Reads the processed accidents CSV and prints a comprehensive
validation report including:
  - Row count
  - Column list
  - Null count per column
  - Severity distribution
  - Date range
"""

import csv
import os
import sys
from collections import Counter
from datetime import datetime

# ── Config ─────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLEAN_CSV  = os.path.join(BASE_DIR, "datasets", "processed", "accidents_clean.csv")
CLEAN_CSV  = os.environ.get("ACCIDENTS_CLEAN_CSV", CLEAN_CSV)


def parse_dt(s: str):
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(s.strip(), fmt)
        except (ValueError, AttributeError):
            continue
    return None


def main():
    if not os.path.exists(CLEAN_CSV):
        print(f"[ERROR] Cleaned CSV not found: {CLEAN_CSV}")
        print("  Run: python scripts/preprocess_data.py first.")
        sys.exit(1)

    print("=" * 65)
    print("ROAD ACCIDENT DATASET — VALIDATION REPORT")
    print("=" * 65)
    print(f"File: {CLEAN_CSV}")
    print()

    row_count   = 0
    null_counts = Counter()
    sev_counts  = Counter()
    dates       = []
    columns     = []

    with open(CLEAN_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        columns = reader.fieldnames or []

        # Initialise null counter for every column
        for col in columns:
            null_counts[col] = 0

        for row in reader:
            row_count += 1

            # Count nulls
            for col in columns:
                val = row.get(col, "")
                if val is None or str(val).strip() == "":
                    null_counts[col] += 1

            # Severity distribution
            sev = row.get("Severity_Label", "Unknown")
            sev_counts[sev] += 1

            # Collect Start_Time for date range
            dt = parse_dt(row.get("Start_Time", ""))
            if dt:
                dates.append(dt)

    # ── Column List ────────────────────────────────────────────────
    print(f"{'─'*65}")
    print(f"COLUMNS ({len(columns)} total):")
    print(f"{'─'*65}")
    for i, col in enumerate(columns, 1):
        print(f"  {i:>3}. {col}")

    # ── Row Count ─────────────────────────────────────────────────
    print(f"\n{'─'*65}")
    print(f"ROW COUNT: {row_count:,}")
    print(f"{'─'*65}")

    # ── Null Counts ────────────────────────────────────────────────
    print(f"\n{'─'*65}")
    print("NULL COUNTS PER COLUMN:")
    print(f"{'─'*65}")
    print(f"  {'Column':<35} {'Nulls':>8}  {'%':>6}")
    print(f"  {'─'*35}  {'─'*8}  {'─'*6}")
    for col in columns:
        cnt = null_counts[col]
        pct = (cnt / row_count * 100) if row_count else 0
        flag = " ⚠" if pct > 5 else ""
        print(f"  {col:<35} {cnt:>8,}  {pct:>5.1f}%{flag}")

    # ── Severity Distribution ──────────────────────────────────────
    print(f"\n{'─'*65}")
    print("SEVERITY DISTRIBUTION:")
    print(f"{'─'*65}")
    for label in ["Minor", "Moderate", "Severe", "Unknown"]:
        cnt = sev_counts.get(label, 0)
        pct = (cnt / row_count * 100) if row_count else 0
        bar = "█" * int(pct / 2)
        print(f"  {label:<10}: {cnt:>8,}  ({pct:>5.1f}%)  {bar}")

    # ── Date Range ─────────────────────────────────────────────────
    print(f"\n{'─'*65}")
    print("DATE RANGE:")
    print(f"{'─'*65}")
    if dates:
        print(f"  Earliest: {min(dates).strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Latest  : {max(dates).strftime('%Y-%m-%d %H:%M:%S')}")
        span = max(dates) - min(dates)
        print(f"  Span    : {span.days} days  (~{span.days // 365} years)")
    else:
        print("  No valid dates found.")

    print(f"\n{'='*65}")
    print("Validation complete.")
    print(f"{'='*65}")


if __name__ == "__main__":
    main()
