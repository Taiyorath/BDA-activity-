#!/usr/bin/env python3
"""
MapReduce Mapper — Hourly Accident Count
Reads CSV from stdin, parses Start_Time, emits: hour<TAB>1
Skips the header row by detecting the "ID" field in column 0.
"""

import sys
import csv
from datetime import datetime

# Column index for Start_Time in the raw CSV
START_TIME_IDX = 3

def parse_hour(dt_str: str):
    """Return the hour (0-23) from a datetime string, or None on failure."""
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(dt_str.strip(), fmt).hour
        except ValueError:
            continue
    return None

def main():
    reader = csv.reader(sys.stdin)
    first_line = True
    for row in reader:
        # Skip header row
        if first_line:
            first_line = False
            if row and row[0].strip().upper() == "ID":
                continue
        if len(row) <= START_TIME_IDX:
            continue
        hour = parse_hour(row[START_TIME_IDX])
        if hour is not None:
            print(f"{hour}\t1")

if __name__ == "__main__":
    main()
