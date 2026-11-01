#!/usr/bin/env python3
"""
MapReduce Mapper — Severity Accident Count
Reads CSV from stdin, emits: severity<TAB>1
Skips the header row by detecting the "ID" field in column 0.
"""

import sys
import csv

# Column index for Severity in the raw/processed CSV
SEVERITY_IDX = 2

def main():
    reader = csv.reader(sys.stdin)
    first_line = True
    for row in reader:
        # Skip header row
        if first_line:
            first_line = False
            if row and row[0].strip().upper() == "ID":
                continue
        if len(row) <= SEVERITY_IDX:
            continue
        severity = row[SEVERITY_IDX].strip()
        if severity:
            print(f"{severity}\t1")

if __name__ == "__main__":
    main()
