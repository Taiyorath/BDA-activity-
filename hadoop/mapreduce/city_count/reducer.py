#!/usr/bin/env python3
"""
MapReduce Reducer — City Accident Count
Reads sorted key-value pairs from stdin, outputs: city<TAB>total_count
"""

import sys
from itertools import groupby

def read_pairs():
    """Yield (key, value) pairs from stdin."""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        parts = line.split("\t", 1)
        if len(parts) == 2:
            yield parts[0], int(parts[1])

def main():
    for city, pairs in groupby(read_pairs(), key=lambda x: x[0]):
        total = sum(v for _, v in pairs)
        print(f"{city}\t{total}")

if __name__ == "__main__":
    main()
