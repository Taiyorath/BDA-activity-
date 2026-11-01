#!/usr/bin/env python3
"""
MapReduce Mapper — State Accident Count
Reads CSV from stdin, emits: state<TAB>1
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
        if len(row) < 13:
            continue
        state = row[12].strip()  # State is column index 12
        if state:
            print(f"{state}\t1")

if __name__ == "__main__":
    main()
