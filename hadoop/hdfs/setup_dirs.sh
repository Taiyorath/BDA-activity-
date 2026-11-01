#!/bin/bash
# ============================================================
# HDFS Directory Setup Script
# Creates all required HDFS directory structure for the
# Road Accident Pattern Analysis project.
# ============================================================
# Usage: bash hadoop/hdfs/setup_dirs.sh
# ============================================================

set -e  # Exit on error

echo "============================================================"
echo "Setting up HDFS directories for Road Accident Analysis..."
echo "============================================================"

# Core data directories
hdfs dfs -mkdir -p /accidents/raw
hdfs dfs -mkdir -p /accidents/processed

# MapReduce result directories
hdfs dfs -mkdir -p /accidents/results/mapreduce/city_count
hdfs dfs -mkdir -p /accidents/results/mapreduce/state_count
hdfs dfs -mkdir -p /accidents/results/mapreduce/hour_count
hdfs dfs -mkdir -p /accidents/results/mapreduce/severity_count
hdfs dfs -mkdir -p /accidents/results/mapreduce/weather_count

# Hive result directory
hdfs dfs -mkdir -p /accidents/results/hive

# Pig result directories
hdfs dfs -mkdir -p /accidents/results/pig/location_stats
hdfs dfs -mkdir -p /accidents/results/pig/severity_by_state

# Spark result directories
hdfs dfs -mkdir -p /accidents/results/spark/city_freq
hdfs dfs -mkdir -p /accidents/results/spark/severity_analysis
hdfs dfs -mkdir -p /accidents/results/spark/monthly_trends
hdfs dfs -mkdir -p /accidents/results/spark/weather_analysis
hdfs dfs -mkdir -p /accidents/results/spark/location_stats
hdfs dfs -mkdir -p /accidents/results/spark/time_patterns/hourly
hdfs dfs -mkdir -p /accidents/results/spark/time_patterns/daily

echo ""
echo "HDFS directories created successfully."
echo ""
echo "Directory listing:"
hdfs dfs -ls /accidents/
