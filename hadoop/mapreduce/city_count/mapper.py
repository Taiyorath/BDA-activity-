#!/usr/bin/env python3
"""
MapReduce Mapper — City Accident Count
Reads CSV from stdin, emits: city<TAB>1
Skips the header row by detecting the "ID" field in column 0.
"""

import sys
import csv

def main():
    reader = csv.reader(sys.stdin)
    first_line = True
    for row in reader:
        # Skip header row
        if first_line:
            first_line = False
            if row and row[0].strip().upper() == "ID":
                continue
        if len(row) < 11:
            continue
        city = row[10].strip()  # City is column index 10
        if city:
            print(f"{city}\t1")

if __name__ == "__main__":
    main()
