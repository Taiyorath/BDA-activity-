#!/usr/bin/env python3
"""
MapReduce Mapper — Weather Condition Accident Count
Reads CSV from stdin, emits: weather_condition<TAB>1
Skips the header row by detecting the "ID" field in column 0.

Weather_Condition is column index 28 in the raw synthetic CSV.
For the processed CSV it may differ; the mapper looks up the
header row to find the correct index if the first row is a header.
"""

import sys
import csv

# Default column index for Weather_Condition in raw CSV
DEFAULT_WEATHER_IDX = 28

def main():
    reader = csv.reader(sys.stdin)
    weather_idx = DEFAULT_WEATHER_IDX
    first_line = True

    for row in reader:
        # Detect and skip header row; also use it to find column index
        if first_line:
            first_line = False
            if row and row[0].strip().upper() == "ID":
                # Resolve column index dynamically from header
                header = [c.strip() for c in row]
                if "Weather_Condition" in header:
                    weather_idx = header.index("Weather_Condition")
                continue

        if len(row) <= weather_idx:
            continue
        weather = row[weather_idx].strip()
        if weather:
            print(f"{weather}\t1")

if __name__ == "__main__":
    main()
