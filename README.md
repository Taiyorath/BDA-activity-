<div align="center">

# 🚦 Road Accident Pattern Analysis and Black Spot Identification Using Hadoop
### Distributed Big Data Engineering · Geospatial Hotspot Identification · Full-Stack React & FastAPI Platform

[![GitHub Repository](https://img.shields.io/badge/GitHub-Taiyorath%2FBDA--activity--green?logo=github&style=for-the-badge)](https://github.com/Taiyorath/BDA-activity-)
[![Hadoop](https://img.shields.io/badge/Apache_Hadoop-3.3.6-FFCC00?logo=apachehadoop&logoColor=black&style=for-the-badge)](https://hadoop.apache.org/)
[![Spark](https://img.shields.io/badge/Apache_Spark-3.5.1-E25A1C?logo=apachespark&logoColor=white&style=for-the-badge)](https://spark.apache.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white&style=for-the-badge)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Viva Guide](https://img.shields.io/badge/Viva_Defense_Guide-9_Pages_PDF-D97757?style=for-the-badge)](./Road_Accident_Analytics_Hadoop_Viva_Guide.pdf)

> **Academic Assessment:** Computer Science Engineering · Big Data Analytics (BDA) Activity-Based Assessment  
> **Author & Repository Owner:** [Taiyorath](https://github.com/Taiyorath)  
> **Official Repository:** [https://github.com/Taiyorath/BDA-activity-.git](https://github.com/Taiyorath/BDA-activity-)

</div>

---

A complete, production-grade Big Data Analytics application demonstrating how the **Apache Hadoop ecosystem** processes, analyzes, and visualizes large-scale road accident datasets to identify accident-prone locations (black spots), evaluate environmental risk covariates, and drive infrastructure safety decisions.

---

## 📋 Table of Contents

1. [Project Abstract](#1-project-abstract)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Project Structure](#6-project-structure)
7. [Dataset](#7-dataset)
8. [Hadoop Implementation Modules](#8-hadoop-implementation-modules)
   - [Module A — HDFS](#module-a--hdfs--distributed-storage)
   - [Module B — MapReduce](#module-b--mapreduce--distributed-processing)
   - [Module C — Apache Hive](#module-c--apache-hive--analytical-queries)
   - [Module D — Apache Pig](#module-d--apache-pig--data-cleaning)
   - [Module E — Apache Spark](#module-e--apache-spark--advanced-analytics)
9. [Black Spot Identification](#9-black-spot-identification)
10. [React Frontend — Detailed Implementation Plan](#10-react-frontend--detailed-implementation-plan)
    - [Component Tree](#101-component-tree)
    - [Page-by-Page Breakdown](#102-page-by-page-breakdown)
    - [State Management](#103-state-management)
    - [API Integration Layer](#104-api-integration-layer)
    - [Charts & Maps](#105-charts--maps)
    - [Routing](#106-routing)
    - [Theming & Styling](#107-theming--styling)
    - [Build & Dev Tooling](#108-build--dev-tooling)
11. [Backend API](#11-backend-api)
12. [Docker Setup](#12-docker-setup)
13. [Installation & Setup Guide](#13-installation--setup-guide)
14. [Execution Commands](#14-execution-commands)
15. [Hardware & Software Requirements](#15-hardware--software-requirements)
16. [Development Phases](#16-development-phases)
17. [Limitations](#17-limitations)
18. [Future Enhancements](#18-future-enhancements)
19. [Viva Q&A Reference](#19-viva-qa-reference)
20. [References](#20-references)

---

## 1. Project Abstract

Road accidents remain one of the leading causes of fatalities worldwide. Government and transport agencies collect millions of accident records annually, yet manual analysis is impractical at scale. This project applies the **Apache Hadoop ecosystem** — HDFS, MapReduce, Hive, Pig and Spark — to a large-scale road accident dataset to uncover accident patterns, identify high-risk locations (black spots) and present actionable insights through an interactive React dashboard.

The system ingests raw CSV accident data, stores it in HDFS, cleans and transforms it with Pig, runs parallel analytics through MapReduce, executes SQL-style queries via Hive, performs advanced statistical analysis with PySpark and exposes results through a REST API consumed by a modern analytics frontend.

---

## 2. Problem Statement

Road authorities collect large volumes of accident data — location, date, time, weather conditions, road surface, and severity — but lack scalable tooling to derive patterns from it. Traditional RDBMS approaches fail at millions of records. Questions that remain unanswered include:

- Which locations experience the highest accident frequency?
- During which hours do accidents peak?
- Which weather conditions correlate with more accidents?
- Which areas should be prioritised for infrastructure improvement?

This system answers those questions using Big Data technologies.

---

## 3. Objectives

| # | Objective |
|---|-----------|
| 1 | Store large accident datasets using Hadoop HDFS |
| 2 | Process accident records using MapReduce |
| 3 | Perform analytical SQL queries using Apache Hive |
| 4 | Clean and transform datasets using Apache Pig |
| 5 | Perform advanced analytics using Apache Spark / PySpark |
| 6 | Identify accident hotspots and high-risk locations |
| 7 | Visualise accident patterns in interactive dashboards |
| 8 | Demonstrate Big Data technologies in a real-world domain |

---

## 4. Technology Stack

### Big Data Backend

| Tool | Version | Purpose |
|------|---------|---------|
| Apache Hadoop | 3.3.6 | Distributed processing ecosystem |
| HDFS | 3.3.6 | Distributed file storage |
| MapReduce | 3.3.6 | Parallel batch processing |
| YARN | 3.3.6 | Resource management |
| Apache Hive | 3.1.3 | SQL-based analytics |
| Apache Pig | 0.17.0 | Data cleaning & transformation |
| Apache Spark | 3.5.x | Advanced analytics engine |
| PySpark | 3.5.x | Python API for Spark |
| Python | 3.10+ | Scripting & REST API |

### Frontend

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript 5 | Type safety |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Recharts | Charting library |
| React-Leaflet 4 | Interactive map |
| Leaflet.heat | Heatmap layer |
| React Router 6 | Client-side routing |
| Zustand | Lightweight state management |
| Axios | HTTP client |
| React Query (TanStack) | Server-state caching |

### Backend

| Tool | Purpose |
|------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pandas | Data preprocessing |
| subprocess | Hadoop job execution |
| Docker Compose | Service orchestration |

---

## 5. System Architecture

```
DATA SOURCES
    │
    ▼
ROAD ACCIDENT DATASETS (CSV)
    │
    ▼
DATA INGESTION (Python scripts / cURL upload)
    │
    ▼
┌─────────────────────────────────┐
│         HADOOP HDFS             │
│  /accidents/raw/                │
│  /accidents/processed/          │
│  /accidents/results/            │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
APACHE PIG       MAPREDUCE
(Cleaning)       (Counting)
    └────────┬────────┘
             ▼
        APACHE HIVE
     (SQL Analytics)
             │
             ▼
        APACHE SPARK
     (Advanced Analytics)
             │
             ▼
     ANALYTICAL RESULTS
     (stored in HDFS)
             │
             ▼
      FASTAPI REST API
             │
             ▼
   REACT ANALYTICS DASHBOARD
```

**YARN** manages resources and schedules all Hadoop applications.

---

## 6. Project Structure

```
road-accident-hadoop/
│
├── frontend/                        # React + TypeScript + Vite
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/              # Shared reusable components
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── Tooltip.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── AppShell.tsx
│   │   │   ├── charts/
│   │   │   │   ├── BarChartWrapper.tsx
│   │   │   │   ├── LineChartWrapper.tsx
│   │   │   │   ├── PieChartWrapper.tsx
│   │   │   │   ├── AreaChartWrapper.tsx
│   │   │   │   └── HeatmapChart.tsx
│   │   │   ├── maps/
│   │   │   │   ├── AccidentMap.tsx
│   │   │   │   ├── HeatmapLayer.tsx
│   │   │   │   ├── ClusterMarker.tsx
│   │   │   │   └── HotspotPopup.tsx
│   │   │   └── kpi/
│   │   │       └── KPICard.tsx
│   │   ├── pages/
│   │   │   ├── Overview.tsx
│   │   │   ├── AccidentAnalytics.tsx
│   │   │   ├── BlackSpotDetection.tsx
│   │   │   ├── TimeAnalysis.tsx
│   │   │   ├── WeatherAnalysis.tsx
│   │   │   ├── SeverityAnalysis.tsx
│   │   │   ├── HadoopOperations.tsx
│   │   │   ├── DataManagement.tsx
│   │   │   └── About.tsx
│   │   ├── services/
│   │   │   ├── api.ts               # Axios instance & base config
│   │   │   ├── dashboardService.ts
│   │   │   ├── accidentService.ts
│   │   │   ├── hotspotService.ts
│   │   │   └── hadoopService.ts
│   │   ├── hooks/
│   │   │   ├── useDashboardSummary.ts
│   │   │   ├── useAccidentData.ts
│   │   │   ├── useHotspots.ts
│   │   │   ├── useHadoopJob.ts
│   │   │   └── useTheme.ts
│   │   ├── store/
│   │   │   ├── useAppStore.ts       # Zustand global store
│   │   │   └── useFilterStore.ts
│   │   ├── types/
│   │   │   ├── accident.ts
│   │   │   ├── hotspot.ts
│   │   │   ├── hadoop.ts
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── colorScale.ts
│   │   │   └── mapHelpers.ts
│   │   ├── constants/
│   │   │   └── sidebarNav.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                         # FastAPI REST API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── config.py
│   │   └── dependencies.py
│   ├── routes/
│   │   ├── dashboard.py
│   │   ├── accidents.py
│   │   ├── hotspots.py
│   │   └── hadoop.py
│   ├── services/
│   │   ├── data_service.py
│   │   ├── hotspot_service.py
│   │   ├── hdfs_service.py
│   │   ├── mapreduce_service.py
│   │   ├── hive_service.py
│   │   ├── pig_service.py
│   │   └── spark_service.py
│   ├── models/
│   │   ├── accident.py
│   │   └── hotspot.py
│   └── config/
│       └── settings.py
│
├── hadoop/                          # Hadoop ecosystem scripts
│   ├── mapreduce/
│   │   ├── city_count/
│   │   │   ├── mapper.py
│   │   │   └── reducer.py
│   │   ├── severity_count/
│   │   │   ├── mapper.py
│   │   │   └── reducer.py
│   │   ├── hour_count/
│   │   │   ├── mapper.py
│   │   │   └── reducer.py
│   │   ├── weather_count/
│   │   │   ├── mapper.py
│   │   │   └── reducer.py
│   │   └── state_count/
│   │       ├── mapper.py
│   │       └── reducer.py
│   ├── hive/
│   │   ├── create_tables.hql
│   │   ├── load_data.hql
│   │   └── queries/
│   │       ├── accidents_by_state.hql
│   │       ├── accidents_by_city.hql
│   │       ├── hourly_distribution.hql
│   │       ├── severity_distribution.hql
│   │       ├── weather_analysis.hql
│   │       ├── monthly_trends.hql
│   │       ├── yearly_stats.hql
│   │       └── severe_locations.hql
│   ├── pig/
│   │   ├── clean_accidents.pig
│   │   ├── location_stats.pig
│   │   └── severity_filter.pig
│   ├── spark/
│   │   ├── accident_frequency.py
│   │   ├── severity_analysis.py
│   │   ├── monthly_trends.py
│   │   ├── weather_analysis.py
│   │   ├── location_stats.py
│   │   └── time_patterns.py
│   └── hdfs/
│       ├── setup_dirs.sh
│       └── upload_data.sh
│
├── datasets/
│   ├── raw/
│   │   └── .gitkeep
│   ├── processed/
│   │   └── .gitkeep
│   └── synthetic/
│       └── generate_synthetic.py    # Generates 100 000+ labelled records
│
├── scripts/
│   ├── setup_environment.sh
│   ├── start_services.sh
│   ├── stop_services.sh
│   ├── preprocess_data.py
│   └── validate_dataset.py
│
├── docker/
│   ├── docker-compose.yml
│   ├── hadoop/
│   │   └── Dockerfile
│   ├── backend/
│   │   └── Dockerfile
│   └── frontend/
│       └── Dockerfile
│
├── documentation/
│   ├── system_architecture.md
│   ├── dataset_description.md
│   ├── hadoop_tool_descriptions.md
│   ├── api_reference.md
│   ├── setup_guide.md
│   └── viva_questions.md
│
├── requirements.txt                 # Python dependencies
├── README.md                        # This file
└── .env.example                     # Environment variable template
```

---

## 7. Dataset

### Primary Source

| Property | Value |
|----------|-------|
| Dataset | US Accidents (2016–2023) |
| Source | [Kaggle – Sobhan Moosavi](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents) |
| Records | ~7.7 million |
| Format | CSV |

### Indian Road Accident Data (Supplementary)

Source: [data.gov.in](https://data.gov.in/) — Road Accidents section.

### Key Columns Used

| Column | Description |
|--------|-------------|
| `ID` | Unique accident identifier |
| `Severity` | 1 (least) – 4 (most severe) |
| `Start_Time` | Date and time of accident |
| `Start_Lat`, `Start_Lng` | GPS coordinates |
| `City`, `State` | Location |
| `Weather_Condition` | e.g. Rain, Clear, Fog |
| `Road_Condition` | Road surface description |
| `Temperature(F)` | Ambient temperature |
| `Visibility(mi)` | Visibility in miles |

### Synthetic Dataset

If the Kaggle dataset cannot be downloaded, run:

```bash
python datasets/synthetic/generate_synthetic.py --records 100000
```

> **⚠ IMPORTANT:** Synthetic data is clearly labelled `SYNTHETIC` in all outputs and is never presented as real accident statistics.

### Data Preprocessing Steps

1. Missing-value identification and imputation / removal
2. Duplicate record removal
3. Invalid coordinate filtering (`lat == 0 or lng == 0`)
4. Date and time normalisation (UTC → local time)
5. Severity classification (`1–2` → Minor, `3` → Moderate, `4` → Severe)
6. Location standardisation (city and state name normalisation)
7. Invalid record filtering (negative counts, future dates)
8. Schema validation

Separate raw and cleaned datasets are maintained throughout the pipeline.

---

## 8. Hadoop Implementation Modules

### Module A — HDFS · Distributed Storage

**Objective:** Store and manage large accident datasets in Hadoop's distributed file system.

#### HDFS Directory Structure

```
/accidents/
├── raw/          ← original uploaded CSV files
├── processed/    ← Pig-cleaned output
└── results/
    ├── mapreduce/
    ├── hive/
    └── spark/
```

#### Key Commands

```bash
# Create directory structure
hdfs dfs -mkdir -p /accidents/raw
hdfs dfs -mkdir -p /accidents/processed
hdfs dfs -mkdir -p /accidents/results/mapreduce
hdfs dfs -mkdir -p /accidents/results/hive
hdfs dfs -mkdir -p /accidents/results/spark

# Upload dataset
hdfs dfs -put datasets/processed/accidents_clean.csv /accidents/raw/

# List contents
hdfs dfs -ls /accidents/raw

# Check file size
hdfs dfs -du -h /accidents/raw/

# Check HDFS health
hdfs dfsadmin -report
```

---

### Module B — MapReduce · Distributed Processing

**Objective:** Run parallel batch processing jobs using Hadoop Streaming with Python.

#### Jobs Implemented

| Job | Mapper Input | Output |
|-----|-------------|--------|
| `city_count` | CSV rows | `city \t count` |
| `state_count` | CSV rows | `state \t count` |
| `hour_count` | CSV rows | `hour \t count` |
| `severity_count` | CSV rows | `severity \t count` |
| `weather_count` | CSV rows | `weather_condition \t count` |

#### Mapper Pattern (city_count/mapper.py)

```python
#!/usr/bin/env python3
import sys, csv

reader = csv.DictReader(sys.stdin)
for row in reader:
    city = row.get("City", "").strip()
    if city:
        print(f"{city}\t1")
```

#### Reducer Pattern (city_count/reducer.py)

```python
#!/usr/bin/env python3
import sys
from itertools import groupby
from operator import itemgetter

def parse(line):
    key, count = line.strip().split("\t")
    return key, int(count)

data = (parse(line) for line in sys.stdin)
for key, group in groupby(data, key=itemgetter(0)):
    total = sum(count for _, count in group)
    print(f"{key}\t{total}")
```

#### Execution Command

```bash
hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
  -input  /accidents/raw/accidents_clean.csv \
  -output /accidents/results/mapreduce/city_count \
  -mapper  hadoop/mapreduce/city_count/mapper.py \
  -reducer hadoop/mapreduce/city_count/reducer.py \
  -file    hadoop/mapreduce/city_count/mapper.py \
  -file    hadoop/mapreduce/city_count/reducer.py
```

---

### Module C — Apache Hive · Analytical Queries

**Objective:** Run SQL-based analytics on the accident dataset.

#### Database & Table Setup

```sql
-- create_tables.hql
CREATE DATABASE IF NOT EXISTS road_safety_db;
USE road_safety_db;

CREATE EXTERNAL TABLE IF NOT EXISTS accidents (
  accident_id     STRING,
  severity        INT,
  start_time      STRING,
  start_lat       DOUBLE,
  start_lng       DOUBLE,
  city            STRING,
  state           STRING,
  weather         STRING,
  road_condition  STRING,
  temperature     DOUBLE,
  visibility      DOUBLE
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/accidents/processed/'
TBLPROPERTIES ("skip.header.line.count"="1");
```

#### Analytical Queries

```sql
-- Total accidents by state
SELECT state, COUNT(*) AS total FROM accidents GROUP BY state ORDER BY total DESC LIMIT 10;

-- Accidents by hour
SELECT HOUR(start_time) AS hour, COUNT(*) AS count FROM accidents GROUP BY HOUR(start_time) ORDER BY hour;

-- Severity distribution
SELECT severity, COUNT(*) AS count FROM accidents GROUP BY severity;

-- Weather-based analysis
SELECT weather, COUNT(*) AS count FROM accidents GROUP BY weather ORDER BY count DESC LIMIT 15;

-- Monthly trends
SELECT YEAR(start_time) AS yr, MONTH(start_time) AS mo, COUNT(*) AS count
FROM accidents GROUP BY YEAR(start_time), MONTH(start_time) ORDER BY yr, mo;

-- High-severity locations
SELECT city, state, COUNT(*) AS severe_count
FROM accidents WHERE severity = 4
GROUP BY city, state ORDER BY severe_count DESC LIMIT 20;
```

---

### Module D — Apache Pig · Data Cleaning

**Objective:** Clean and transform raw accident data using Pig Latin scripts.

#### clean_accidents.pig

```pig
-- Load raw accident data
raw_accidents = LOAD '/accidents/raw/accidents_clean.csv'
  USING PigStorage(',')
  AS (id:chararray, severity:int, start_time:chararray, lat:double, lng:double,
      city:chararray, state:chararray, weather:chararray);

-- Filter out records with null or empty city
no_nulls = FILTER raw_accidents BY city IS NOT NULL AND city != '';

-- Remove invalid coordinates
valid_coords = FILTER no_nulls BY lat != 0.0 AND lng != 0.0
               AND lat > -90.0 AND lat < 90.0
               AND lng > -180.0 AND lng < 180.0;

-- Group by location for statistics
by_city = GROUP valid_coords BY (city, state);
city_stats = FOREACH by_city GENERATE
  FLATTEN(group) AS (city, state),
  COUNT(valid_coords) AS total_accidents,
  SUM((valid_coords.severity == 4 ? 1 : 0)) AS severe_count;

-- Store cleaned data
STORE valid_coords  INTO '/accidents/processed/'    USING PigStorage(',');
STORE city_stats    INTO '/accidents/results/pig/'  USING PigStorage('\t');
```

#### Run the script

```bash
pig -x mapreduce hadoop/pig/clean_accidents.pig
```

---

### Module E — Apache Spark · Advanced Analytics

**Objective:** Perform complex, in-memory analytics using PySpark.

#### accident_frequency.py (excerpt)

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, hour, month, year

spark = SparkSession.builder \
    .appName("AccidentFrequencyAnalysis") \
    .enableHiveSupport() \
    .getOrCreate()

df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

# Accident frequency by city
city_freq = df.groupBy("City", "State") \
              .agg(count("*").alias("accident_count")) \
              .orderBy(col("accident_count").desc())

city_freq.write.mode("overwrite").parquet("hdfs:///accidents/results/spark/city_freq/")

# Hourly patterns
hourly = df.withColumn("hour", hour("Start_Time")) \
           .groupBy("hour").agg(count("*").alias("count")) \
           .orderBy("hour")

hourly.write.mode("overwrite").json("hdfs:///accidents/results/spark/hourly/")

spark.stop()
```

#### Submit a Spark job

```bash
spark-submit \
  --master yarn \
  --deploy-mode cluster \
  hadoop/spark/accident_frequency.py
```

---

## 9. Black Spot Identification

A **black spot** is a geographic location with an unusually high concentration of road accidents.

### Algorithm

1. **Grid-based clustering** — divide the map into 0.01° × 0.01° grid cells (≈ 1 km²)
2. **Accident aggregation** — count total and severity-weighted accidents per cell
3. **Risk scoring** — `score = total_accidents + (severe_accidents × 3)`
4. **Percentile thresholds:**

| Risk Level | Percentile Threshold |
|------------|---------------------|
| Low Risk | 50th–70th percentile |
| Moderate Risk | 70th–85th percentile |
| High Risk | 85th–95th percentile |
| Critical Risk | > 95th percentile |

### Hotspot Record

Each hotspot exposes:

```json
{
  "lat": 34.0522,
  "lng": -118.2437,
  "city": "Los Angeles",
  "state": "CA",
  "total_accidents": 1847,
  "severe_accidents": 312,
  "moderate_accidents": 589,
  "minor_accidents": 946,
  "risk_score": 2783,
  "risk_level": "Critical Risk"
}
```

### Map Visualisation

- Leaflet base map (OpenStreetMap tiles)
- `leaflet.heat` heatmap layer for density
- Clustered markers (colour-coded by risk level)
- Click-to-inspect popup with full hotspot details
- Risk filter controls in the sidebar panel

---

## 10. React Frontend — Detailed Implementation Plan

> This section provides the complete, file-level breakdown of every React component, page, hook, service and configuration item required to build the analytics dashboard.

---

### 10.1 Component Tree

```
App
└── AppShell
    ├── Sidebar
    │   ├── SidebarLogo
    │   ├── SidebarNavItem  (×9 pages)
    │   └── SidebarFooter
    ├── Topbar
    │   ├── PageTitle
    │   ├── ThemeToggle
    │   └── NotificationBell
    └── <Outlet />  (React Router page slot)
        ├── Overview
        │   ├── KPICard (×5)
        │   ├── BarChartWrapper  (state distribution)
        │   ├── LineChartWrapper (monthly trend)
        │   └── PieChartWrapper  (severity split)
        ├── AccidentAnalytics
        │   ├── FilterBar
        │   ├── BarChartWrapper  (state-wise)
        │   ├── BarChartWrapper  (city-wise)
        │   ├── LineChartWrapper (monthly)
        │   └── LineChartWrapper (yearly)
        ├── BlackSpotDetection
        │   ├── RiskFilterPanel
        │   ├── AccidentMap
        │   │   ├── HeatmapLayer
        │   │   └── ClusterMarker → HotspotPopup
        │   └── HotspotTable
        ├── TimeAnalysis
        │   ├── AreaChartWrapper (hourly)
        │   ├── BarChartWrapper  (day-of-week)
        │   ├── HeatmapChart     (hour × day grid)
        │   └── PeakPeriodCard
        ├── WeatherAnalysis
        │   ├── PieChartWrapper  (weather types)
        │   ├── BarChartWrapper  (accidents by weather)
        │   └── BarChartWrapper  (road surface)
        ├── SeverityAnalysis
        │   ├── PieChartWrapper
        │   ├── BarChartWrapper  (severity by location)
        │   └── BarChartWrapper  (severity by weather)
        ├── HadoopOperations
        │   ├── HDFSExplorer
        │   ├── MapReduceConsole
        │   ├── HiveQueryConsole
        │   ├── PigScriptViewer
        │   ├── SparkJobPanel
        │   └── YARNMonitor
        ├── DataManagement
        │   ├── FileUploadZone
        │   ├── DatasetTable
        │   └── PreprocessingStatus
        └── About
            ├── ProjectInfo
            ├── TechStackGrid
            └── TeamCard
```

---

### 10.2 Page-by-Page Breakdown

#### `Overview.tsx`

**Purpose:** Landing page showing high-level KPIs and trend summaries.

| Element | Data Source | Component |
|---------|------------|-----------|
| Total Accident Records | `GET /api/dashboard/summary` | `KPICard` |
| Total Severe Accidents | same | `KPICard` |
| Identified Hotspots | same | `KPICard` |
| Average Accidents/Day | same | `KPICard` |
| Most Affected Location | same | `KPICard` |
| State Distribution (Top 10) | `GET /api/accidents/by-location` | `BarChartWrapper` |
| Monthly Trend | `GET /api/accidents/trends` | `LineChartWrapper` |
| Severity Split | `GET /api/accidents/by-severity` | `PieChartWrapper` |

**State:** Loaded via `useDashboardSummary` hook (React Query).

---

#### `AccidentAnalytics.tsx`

**Purpose:** Deep-dive analytics with filterable charts.

| Element | Data Source | Notes |
|---------|------------|-------|
| Year filter | `FilterBar` | Updates all charts |
| State filter | `FilterBar` | Multi-select |
| State-wise accidents | `GET /api/accidents/by-location?group=state` | Horizontal bar chart |
| City-wise accidents (Top 20) | `GET /api/accidents/by-location?group=city` | Vertical bar chart |
| Monthly trend line | `GET /api/accidents/trends?interval=month` | Line chart |
| Yearly bar | `GET /api/accidents/trends?interval=year` | Bar chart |

---

#### `BlackSpotDetection.tsx`

**Purpose:** The flagship feature — interactive hotspot map.

**Sub-components:**

- **`RiskFilterPanel`** — checkboxes for Low / Moderate / High / Critical; toggles marker visibility
- **`AccidentMap`** — `MapContainer` from `react-leaflet`; default center = centroid of data
  - **`HeatmapLayer`** — uses `leaflet.heat`; weight = `risk_score`
  - **`ClusterMarker`** — `MarkerClusterGroup` from `react-leaflet-cluster`; colour based on `risk_level`
  - **`HotspotPopup`** — shows name, counts, risk badge on click
- **`HotspotTable`** — sortable / searchable table with all hotspot records; clicking a row pans the map

**Data:** `GET /api/hotspots?risk_level=High,Critical` (filtered by panel state)

---

#### `TimeAnalysis.tsx`

**Purpose:** Reveal temporal patterns in accident occurrence.

| Chart | Type | Data |
|-------|------|------|
| Accidents by Hour (0–23) | AreaChart | `GET /api/accidents/by-time?group=hour` |
| Accidents by Day-of-Week | BarChart | `GET /api/accidents/by-time?group=day` |
| Hour × Day heatmap grid | Custom SVG grid | derived client-side |
| Peak Period highlight card | — | computed from response |

---

#### `WeatherAnalysis.tsx`

**Purpose:** Explore how weather correlates with accident frequency.

> **Note:** Correlation is presented; causal claims are explicitly avoided in all labels.

| Chart | Type | Data |
|-------|------|------|
| Weather condition distribution | PieChart | `GET /api/accidents/by-weather` |
| Top 10 weather types by accident count | BarChart | same endpoint |
| Road surface condition comparison | BarChart | `GET /api/accidents/by-weather?group=road_condition` |

---

#### `SeverityAnalysis.tsx`

**Purpose:** Break down severity (Minor / Moderate / Severe) across dimensions.

| Chart | Type | Data |
|-------|------|------|
| Overall severity distribution | PieChart | `GET /api/accidents/by-severity` |
| Severity by top 10 states | Grouped BarChart | `GET /api/accidents/by-severity?group=state` |
| Severity by weather condition | Stacked BarChart | `GET /api/accidents/by-severity?group=weather` |

---

#### `HadoopOperations.tsx`

**Purpose:** Demonstrate and interact with the Hadoop ecosystem (key for academic assessment).

Six tabbed panels:

**Tab 1 — HDFS Explorer**

- Tree view of HDFS directories (`GET /api/hadoop/hdfs`)
- File name, size, modification date columns
- "Upload Dataset" button → opens `FileUploadZone` modal → `POST /api/hadoop/upload`
- Status badges: `HEALTHY` / `DEGRADED` / `UNAVAILABLE`

**Tab 2 — MapReduce Console**

```
┌─────────────────────────────────────────┐
│  Job: city_count                  [RUN] │
│  Mapper:  city_count/mapper.py          │
│  Reducer: city_count/reducer.py         │
│  Status:  ● COMPLETED                   │
│  Duration: 48 s                         │
│  ─────────────────────────────────────  │
│  MAPPER SOURCE          REDUCER SOURCE  │
│  [code block]           [code block]    │
│  ─────────────────────────────────────  │
│  OUTPUT (first 50 rows)                 │
│  Los Angeles   14 832                   │
│  Houston        9 211                   │
│  ...                                    │
└─────────────────────────────────────────┘
```

Endpoint: `POST /api/hadoop/mapreduce/run` with `{ "job": "city_count" }`.

**Tab 3 — Hive Query Console**

- Dropdown of 8 predefined HQL queries
- Syntax-highlighted query preview (read-only `<pre>` block)
- `[Execute]` button → `POST /api/hadoop/hive/execute`
- Results rendered in a paginated `Table` component
- Execution log textarea (last 20 log lines)

**Tab 4 — Pig Script Viewer**

- Script selector dropdown
- Syntax-highlighted Pig Latin source
- `[Run Script]` button → `POST /api/hadoop/pig/run`
- Execution status and output count

**Tab 5 — Spark Analytics**

- Job cards: frequency / severity / monthly / weather / location / time
- Each card shows: description, operation type, status badge, `[Submit]` button
- Clicking Submit → `POST /api/hadoop/spark/run` with job name
- Output preview (row count, sample rows, timing)

**Tab 6 — YARN Monitor**

- Application table: app name, state, progress, containers, memory, started
- `GET /api/hadoop/yarn` refreshes every 10 s
- If YARN is unreachable → grey "YARN Unavailable" empty state with reason

> **Academic honesty:** Every execution result is either **genuinely executed** or labelled **"[SIMULATED OUTPUT]"** in a yellow badge.

---

#### `DataManagement.tsx`

**Purpose:** Upload, inspect and manage datasets.

- Drag-and-drop upload zone (CSV only)
- Progress bar during upload
- Uploaded datasets table (name, size, row count, status)
- Preprocessing pipeline trigger button
- Validation report inline

---

#### `About.tsx`

**Purpose:** Project information, tech stack and academic context.

- Project title, institution, course, abstract
- Tech stack grid (logo + name + version)
- Data source cards with links
- Hadoop tool description cards

---

### 10.3 State Management

#### Global Store — `store/useAppStore.ts` (Zustand)

```typescript
interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeDataset: string | null;
  hadoopStatus: 'connected' | 'disconnected' | 'checking';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setActiveDataset: (name: string) => void;
  setHadoopStatus: (status: AppState['hadoopStatus']) => void;
}
```

#### Filter Store — `store/useFilterStore.ts` (Zustand)

```typescript
interface FilterState {
  selectedYears: number[];
  selectedStates: string[];
  selectedRiskLevels: string[];
  setYears: (years: number[]) => void;
  setStates: (states: string[]) => void;
  setRiskLevels: (levels: string[]) => void;
  resetFilters: () => void;
}
```

#### Server State — React Query (TanStack Query v5)

All API calls use `useQuery` / `useMutation` with:
- 5-minute stale time for analytics data
- Automatic background refetch on window focus
- Retry × 2 on failure
- Loading / error / empty states handled per component

---

### 10.4 API Integration Layer

#### `services/api.ts`

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 60_000,                    // Hadoop jobs can be slow
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    // Global error normalisation
    return Promise.reject(err);
  }
);
```

#### Service Modules

| File | Exports |
|------|---------|
| `dashboardService.ts` | `fetchSummary()` |
| `accidentService.ts` | `fetchByLocation()`, `fetchBySeverity()`, `fetchByWeather()`, `fetchByTime()`, `fetchTrends()` |
| `hotspotService.ts` | `fetchHotspots(filters)` |
| `hadoopService.ts` | `listHDFS()`, `uploadDataset(file)`, `runMapReduce(job)`, `executeHive(query)`, `runPig(script)`, `runSpark(job)`, `getYARNStatus()` |

---

### 10.5 Charts & Maps

#### Chart Wrappers (Recharts)

Every wrapper accepts a unified props interface:

```typescript
interface ChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string | string[];       // supports grouped/stacked
  title?: string;
  height?: number;
  colors?: string[];
  loading?: boolean;
}
```

| Component | Recharts Element | Use Case |
|-----------|-----------------|----------|
| `BarChartWrapper` | `BarChart` | Categorical comparisons |
| `LineChartWrapper` | `LineChart` | Trends over time |
| `AreaChartWrapper` | `AreaChart` | Hourly distributions |
| `PieChartWrapper` | `PieChart` + `Cell` | Part-to-whole ratios |
| `HeatmapChart` | Custom SVG grid | Hour × day intensity |

All charts include:
- Animated entry
- Custom tooltip
- Responsive container
- Legend
- Skeleton loader while data fetches

#### Maps (React-Leaflet)

```typescript
// AccidentMap.tsx — core structure
<MapContainer center={[37.0, -95.7]} zoom={5} style={{ height: '600px' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <HeatmapLayer points={hotspots} />
  <MarkerClusterGroup>
    {hotspots.map(spot => (
      <CircleMarker key={spot.id} center={[spot.lat, spot.lng]}
        radius={riskToRadius(spot.risk_level)}
        color={riskToColor(spot.risk_level)}>
        <Popup><HotspotPopup data={spot} /></Popup>
      </CircleMarker>
    ))}
  </MarkerClusterGroup>
</MapContainer>
```

---

### 10.6 Routing

```typescript
// App.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,               element: <Navigate to="/overview" replace /> },
      { path: 'overview',          element: <Overview /> },
      { path: 'analytics',         element: <AccidentAnalytics /> },
      { path: 'blackspots',        element: <BlackSpotDetection /> },
      { path: 'time-analysis',     element: <TimeAnalysis /> },
      { path: 'weather',           element: <WeatherAnalysis /> },
      { path: 'severity',          element: <SeverityAnalysis /> },
      { path: 'hadoop',            element: <HadoopOperations /> },
      { path: 'data',              element: <DataManagement /> },
      { path: 'about',             element: <About /> },
    ],
  },
]);
```

---

### 10.7 Theming & Styling

- **Tailwind CSS** with a custom config:
  - Extended colour palette (`brand-*`, `risk-low`, `risk-moderate`, `risk-high`, `risk-critical`)
  - Custom `font-family`: Inter (Google Fonts)
  - Dark mode via `class` strategy
- **CSS variables** for chart colours, synchronized with Tailwind theme
- **No excessive gradients** — flat cards with subtle shadows
- Responsive breakpoints: `sm` 640 px · `md` 768 px · `lg` 1024 px · `xl` 1280 px

```typescript
// tailwind.config.ts (excerpt)
theme: {
  /* Claude Editorial Warm Palette & Dark Espresso Surfaces */
  --color-brand-500: #D97757; /* Terracotta Coral */
  --color-claude-bg-light: #FBF9F5; /* Warm Parchment */
  --color-claude-bg-dark: #181715; /* Espresso Charcoal */
  --font-serif: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
```

---

### 10.8 Build & Dev Tooling

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4033, // Default stable frontend port
    host: '0.0.0.0',
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
});
```

**Dev commands:**

```bash
cd frontend
npm install
npm run dev        # starts at http://localhost:4033
npm run build      # production build
npm run preview    # preview production build
npm run type-check # tsc --noEmit
```

---

## 11. Backend API

Built with **FastAPI** (Python 3.10+).

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/dashboard/summary` | KPI summary |
| `GET` | `/api/accidents/by-location` | Accidents by city / state |
| `GET` | `/api/accidents/by-severity` | Severity distribution |
| `GET` | `/api/accidents/by-weather` | Weather-based analysis |
| `GET` | `/api/accidents/by-time` | Hourly / daily / monthly |
| `GET` | `/api/accidents/trends` | Monthly / yearly trends |
| `GET` | `/api/hotspots` | Black spot list with risk levels |
| `GET` | `/api/hadoop/hdfs` | HDFS directory listing |
| `POST` | `/api/hadoop/upload` | Upload CSV to HDFS |
| `POST` | `/api/hadoop/mapreduce/run` | Submit MapReduce job |
| `POST` | `/api/hadoop/hive/execute` | Execute predefined Hive query |
| `POST` | `/api/hadoop/pig/run` | Run Pig script |
| `POST` | `/api/hadoop/spark/run` | Submit Spark job |
| `GET` | `/api/hadoop/jobs` | List submitted jobs and statuses |
| `GET` | `/api/hadoop/yarn` | YARN resource manager status |

> **Security:** Only predefined, allowlisted Hadoop commands are executed. No free-form shell input is accepted from the frontend.

### Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 12. Docker Setup

Run the entire stack locally with Docker Compose:

```bash
docker compose -f docker/docker-compose.yml up -d
```

#### Services

| Service | Port | Description |
|---------|------|-------------|
| `namenode` | 9870 | HDFS NameNode Web UI |
| `datanode` | 9864 | HDFS DataNode |
| `resourcemanager` | 8088 | YARN ResourceManager Web UI |
| `hive-server` | 10000 | HiveServer2 (JDBC/Thrift) |
| `spark-master` | 8080 | Spark Master Web UI |
| `backend` | 8000 | FastAPI REST API |
| `frontend` | 4033 | React dashboard (Claude Theme) |

```bash
# Stop all services
docker compose -f docker/docker-compose.yml down

# View logs
docker compose -f docker/docker-compose.yml logs -f backend
```

---

## 13. Installation & Setup Guide

### Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| Java (JDK) | 11 |
| Python | 3.10 |
| Node.js | 18 |
| npm | 9 |
| Docker Desktop | 24 |
| Docker Compose | 2.20 |
| Available RAM | 8 GB |
| Disk Space | 20 GB |

### Quick Start (One Command)

The platform includes an automated startup script `start.sh` that checks datasets, cleans up ports, launches both the FastAPI backend and Vite frontend, and opens the dashboard in your default browser:

```bash
chmod +x start.sh
./start.sh
```

### Manual Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/Taiyorath/BDA-activity-.git
cd BDA-activity-

# 2. Copy environment template
cp .env.example .env
# Edit .env with your HDFS and API settings if using live Hadoop clusters

# 3. Prepare the dataset (50,000 synthetic benchmark records or Kaggle US Accidents)
python3 datasets/synthetic/generate_synthetic.py --records 50000 --output datasets/raw/synthetic_accidents.csv

# 4. Preprocess data (spatial sanitization, date deconstruction, severity harmonization)
python3 scripts/preprocess_data.py

# 5. Start Backend API
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# 6. Start React Frontend
cd ../frontend
npm install
npm run dev

# 7. Access the dashboard
#   → Frontend Dashboard: http://localhost:4033
#   → Backend API Docs:   http://localhost:8000/docs
#   → Backend Health:     http://localhost:8000/api/health
```

---

## 14. Execution Commands

### MapReduce

```bash
# Run all MapReduce jobs
bash scripts/run_all_mapreduce.sh

# Run individual job
hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
  -input  /accidents/raw/ \
  -output /accidents/results/mapreduce/city_count \
  -mapper  hadoop/mapreduce/city_count/mapper.py \
  -reducer hadoop/mapreduce/city_count/reducer.py \
  -file    hadoop/mapreduce/city_count/mapper.py \
  -file    hadoop/mapreduce/city_count/reducer.py
```

### Hive

```bash
# Create tables and load data
hive -f hadoop/hive/create_tables.hql
hive -f hadoop/hive/load_data.hql

# Run a specific query
hive -f hadoop/hive/queries/accidents_by_state.hql
```

### Pig

```bash
pig -x mapreduce hadoop/pig/clean_accidents.pig
```

### Spark

```bash
spark-submit --master yarn hadoop/spark/accident_frequency.py
spark-submit --master yarn hadoop/spark/severity_analysis.py
spark-submit --master yarn hadoop/spark/monthly_trends.py
```

---

## 15. Hardware & Software Requirements

### Minimum (Development / Demonstration)

| Resource | Minimum |
|----------|---------|
| CPU | 4 cores |
| RAM | 8 GB |
| Disk | 20 GB free |
| OS | macOS 12+ / Ubuntu 20.04+ / Windows 10 (WSL2) |

### Recommended (Full Hadoop Cluster)

| Resource | Recommended |
|----------|------------|
| CPU | 8+ cores |
| RAM | 16 GB |
| Disk | 50 GB free |
| Nodes | 1 master + 2 data nodes |

### Software Versions

| Software | Version |
|----------|---------|
| Java JDK | 11 (OpenJDK) |
| Apache Hadoop | 3.3.6 |
| Apache Hive | 3.1.3 |
| Apache Pig | 0.17.0 |
| Apache Spark | 3.5.1 |
| Python | 3.10+ |
| Node.js | 18 LTS |
| Docker | 24+ |

---

## 16. Development Phases (Completed Status)

```
Phase 1 — Environment Inspection          [x] Completed
  ├─ Check Java, Python, Docker, Hadoop
  ├─ Identify resource constraints
  └─ Create project scaffold

Phase 2 — Dataset Preparation             [x] Completed
  ├─ Download / generate 50,000 record dataset
  ├─ Inspect schema and map columns
  └─ Run preprocessing pipeline

Phase 3 — Hadoop Implementation           [x] Completed
  ├─ Configure HDFS and upload data
  ├─ Implement and test all MapReduce jobs
  ├─ Create Hive tables and validate queries
  ├─ Write and test Pig scripts
  └─ Implement and test all Spark jobs

Phase 4 — Backend Development             [x] Completed
  ├─ Build FastAPI application with OpenAPI validation
  ├─ Implement all analytical & geospatial API endpoints
  └─ Connect Hadoop execution & simulation services

Phase 5 — Frontend Development            [x] Completed
  ├─ Scaffold Vite + React 18 + TypeScript + Tailwind CSS v4
  ├─ Build Claude-inspired editorial warm parchment & dark espresso layout
  ├─ Build all 9 interactive dashboard pages
  ├─ Implement GIS Predictive Hotspot Studio (density index 1.0–10.0)
  ├─ Integrate Recharts and Leaflet geospatial map layers
  └─ Connect TanStack Query to FastAPI REST API

Phase 6 — Testing & Optimization          [x] Completed
  ├─ Verify data accuracy across 50,000 records
  ├─ Validate Hadoop job outputs & telemetry
  ├─ Ensure zero horizontal scroll bleed across all devices
  └─ 100% mobile responsive verification (360px–768px + mobile drawer)

Phase 7 — Academic Documentation          [x] Completed
  ├─ Capture real execution screenshots & GIS heatmaps
  ├─ Complete 9-page Viva Defense Guide PDF (Road_Accident_Analytics_Hadoop_Viva_Guide.pdf)
  ├─ Comprehensive architectural breakdown
  └─ Detailed Git repository documentation
```

---

## 16.1 Viva Defense Guide & Presentation Artifact

The project includes a publication-grade, 9-page viva defense companion: **`Road_Accident_Analytics_Hadoop_Viva_Guide.pdf`** located in the root repository. It is specifically formatted for external university examiners and evaluation panels, covering:

1. **Executive Project Overview & Academic Justification:** The 3V challenges of accident datasets (Volume, Variety, Velocity).
2. **Master Architecture Blueprint:** 5-layer ingestion, storage, processing, caching, and visualization diagram.
3. **Deep-Dive Hadoop Ecosystem Component Delineation:** HDFS block mechanics, replication factors, MapReduce key-value execution, Hive warehousing, Pig Latin ETL, and PySpark RDDs.
4. **Step-by-Step Viva Explanation Script:** A verbatim 5-minute examiner presentation transcript answering *"Explain your project."*
5. **Exact MapReduce Code Walkthrough:** Mapper token extraction and Reducer aggregation step-by-step trace.
6. **Apache Hive vs Apache Pig vs Apache Spark:** Complete head-to-head architectural decision matrix.
7. **Black Spot Identification Mathematical Formula:** Composite Risk Score calculation and spatial grid clustering logic ($0.01^\circ \approx 1.1\text{km}$).
8. **Top 15 Hardest Viva Defense Questions & Answers:** Direct questions on NameNode failure, block sizes, Hive on Spark, and Spark memory spills.
9. **Emergency Demo Checklist:** Zero-failure step-by-step demo fallback guide.

---

## 17. Limitations

- The system is designed for **batch analytics**, not real-time streaming
- Single-node Hadoop setup limits true distributed processing
- Black spot classification uses a **configurable heuristic** — not an officially recognised standard
- Synthetic datasets, when used, are clearly labelled and must not be presented as real accident data
- Weather correlation charts show association, not causation
- Large datasets (>1 GB) may require increased Docker memory allocation

---

## 18. Future Enhancements

- Integration with real-time accident feeds (Apache Kafka + Spark Streaming)
- Machine learning accident severity prediction (Spark MLlib)
- Multi-node Hadoop cluster deployment (cloud or on-premise)
- OpenStreetMap routing integration for road-section black spot identification
- Alert system for newly identified critical hotspots
- Mobile-responsive progressive web app (PWA)
- Integration with traffic camera data
- Time-series forecasting for seasonal accident trends

---

## 19. Viva Q&A Reference

| Question | Answer |
|----------|--------|
| What is HDFS? | Hadoop Distributed File System — stores data across multiple nodes with replication for fault tolerance |
| What is MapReduce? | A programming model for processing large datasets in parallel across a cluster using map (transform) and reduce (aggregate) phases |
| What is Apache Hive? | A data warehouse tool that provides SQL-like queries (HQL) over HDFS data via MapReduce or Tez |
| What is Apache Pig? | A high-level data flow language (Pig Latin) for ETL operations on large datasets in Hadoop |
| What is Apache Spark? | An in-memory distributed processing framework — up to 100× faster than MapReduce for iterative workloads |
| What is YARN? | Yet Another Resource Negotiator — manages cluster resources and schedules Hadoop applications |
| What is a black spot? | A geographic location with an abnormally high concentration of road accidents; classified by risk score |
| How is risk level calculated? | `risk_score = total_accidents + (severe_accidents × 3)`; levels assigned by percentile thresholds |
| Why use Hadoop for this? | Accident datasets can reach millions of records; Hadoop enables scalable, distributed processing |
| What is Hadoop Streaming? | A utility that allows any executable (including Python) to be used as a MapReduce mapper or reducer |

---

## 20. References

1. Moosavi, S. et al. (2019). *A Countrywide Traffic Accident Dataset*. [https://arxiv.org/abs/1906.05409](https://arxiv.org/abs/1906.05409)
2. Apache Hadoop Documentation — [https://hadoop.apache.org/docs/r3.3.6/](https://hadoop.apache.org/docs/r3.3.6/)
3. Apache Hive Documentation — [https://cwiki.apache.org/confluence/display/Hive/](https://cwiki.apache.org/confluence/display/Hive/)
4. Apache Pig Documentation — [https://pig.apache.org/docs/r0.17.0/](https://pig.apache.org/docs/r0.17.0/)
5. Apache Spark Documentation — [https://spark.apache.org/docs/3.5.1/](https://spark.apache.org/docs/3.5.1/)
6. Recharts — [https://recharts.org/](https://recharts.org/)
7. React-Leaflet — [https://react-leaflet.js.org/](https://react-leaflet.js.org/)
8. FastAPI — [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
9. TanStack Query — [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
10. Kaggle US Accidents Dataset — [https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents)
11. India Open Data Portal — [https://data.gov.in/](https://data.gov.in/)

---

<div align="center">

**Road Accident Pattern Analysis and Black Spot Identification Using Hadoop**
*Big Data Analytics · Computer Science Engineering*

Built with ❤️ using Hadoop · React · FastAPI · PySpark

</div>

