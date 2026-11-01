#!/usr/bin/env python3
"""
MapReduce Reducer — Severity Accident Count
Reads sorted key-value pairs from stdin, outputs: severity<TAB>total_count
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
            try:
                yield parts[0], int(parts[1])
            except ValueError:
                continue

def main():
    for severity, pairs in groupby(read_pairs(), key=lambda x: x[0]):
        total = sum(v for _, v in pairs)
        print(f"{severity}\t{total}")

if __name__ == "__main__":
    main()
