#!/bin/bash
# ============================================================
# HDFS Data Upload Script
# Uploads the cleaned accident CSV to HDFS processed directory.
# ============================================================
# Usage: bash hadoop/hdfs/upload_data.sh [path/to/csv]
#   Default CSV path: datasets/processed/accidents_clean.csv
# ============================================================

set -e  # Exit on error

CSV_PATH="${1:-datasets/processed/accidents_clean.csv}"

echo "============================================================"
echo "Uploading accident data to HDFS..."
echo "============================================================"
echo "Local file : $CSV_PATH"
echo "HDFS target: /accidents/processed/"
echo ""

# Verify local file exists
if [ ! -f "$CSV_PATH" ]; then
    echo "[ERROR] Local file not found: $CSV_PATH"
    echo "  Run preprocess_data.py first to generate the cleaned CSV."
    exit 1
fi

# Upload to HDFS (overwrite if exists)
hdfs dfs -put -f "$CSV_PATH" /accidents/processed/

echo ""
echo "Upload complete. HDFS directory listing:"
hdfs dfs -ls /accidents/processed/
