# Setup Guide — Road Accident Pattern Analysis & Black Spot Identification

> [!IMPORTANT]
> **Docker is the recommended path.** It requires no manual Hadoop installation and starts all services with a single command.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone & Configure](#2-clone--configure)
3. [Path A — Docker Setup (Recommended)](#3-path-a--docker-setup-recommended)
4. [Path B — Manual Setup](#4-path-b--manual-setup)
5. [Dataset Preparation](#5-dataset-preparation)
6. [Starting Services](#6-starting-services)
7. [Verifying Everything Works](#7-verifying-everything-works)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

### Minimum System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM      | 8 GB    | 16 GB       |
| CPU      | 4 cores | 8 cores     |
| Disk     | 10 GB   | 20 GB free  |

### Software Requirements

#### Java 11 (required for Hadoop)

```bash
# macOS
brew install openjdk@11
echo 'export PATH="/usr/local/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y openjdk-11-jdk

# Verify
java -version  # Should show: openjdk version "11.x.x"
```

#### Python 3.10+

```bash
# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt-get install -y python3.11 python3-pip

# Verify
python3 --version  # Should show: Python 3.11.x
```

#### Node.js 18+

```bash
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version   # Should show: v18.x.x
npm --version
```

#### Docker Desktop (for Docker path)

Download and install Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).

```bash
# Verify
docker --version         # Docker version 24.x.x
docker compose version   # Docker Compose version v2.x.x
```

> [!NOTE]
> Allocate at least **6 GB RAM** to Docker in Docker Desktop → Settings → Resources.

---

## 2. Clone & Configure

```bash
# Navigate to the project directory
cd "Road Accident Pattern Analysis and Black Spot Identification Using Hadoop"

# Copy environment configuration
cp .env.example .env

# Edit if needed (defaults work for Docker path)
nano .env
```

---

## 3. Path A — Docker Setup (Recommended)

This spins up Hadoop (NameNode + DataNode + ResourceManager), the FastAPI backend, and the React frontend — all containerised.

### Step 1 — Build and Start

```bash
# From project root
docker compose -f docker/docker-compose.yml up --build -d
```

First build takes ~5–10 minutes. Subsequent starts take ~30 seconds.

### Step 2 — Generate and Load Dataset

```bash
# Generate 100 000-record synthetic dataset
docker exec accident-backend python3 datasets/synthetic/generate_synthetic.py --records 100000

# Preprocess (clean, normalise)
docker exec accident-backend python3 scripts/preprocess_data.py

# Upload to HDFS
docker exec namenode hdfs dfs -mkdir -p /accidents/processed
docker exec namenode hdfs dfs -put /datasets/processed/accidents_clean.csv /accidents/processed/
```

### Step 3 — Run MapReduce Jobs (optional)

```bash
docker exec namenode bash /app/scripts/run_all_mapreduce.sh
```

### Stopping Docker Services

```bash
docker compose -f docker/docker-compose.yml down

# To also remove volumes (deletes HDFS data)
docker compose -f docker/docker-compose.yml down -v
```

---

## 4. Path B — Manual Setup

Use this path if you have Hadoop installed locally or want to run without Docker.

### Step 1 — Install Hadoop 3.x

```bash
# macOS (via Homebrew)
brew install hadoop

# Or download manually
wget https://downloads.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz
tar -xzf hadoop-3.3.6.tar.gz -C /usr/local/
export HADOOP_HOME=/usr/local/hadoop-3.3.6
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```

### Step 2 — Configure Hadoop (Pseudo-Distributed Mode)

Edit `$HADOOP_HOME/etc/hadoop/core-site.xml`:

```xml
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://localhost:9000</value>
  </property>
</configuration>
```

Edit `$HADOOP_HOME/etc/hadoop/hdfs-site.xml`:

```xml
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>
</configuration>
```

Format and start HDFS:

```bash
hdfs namenode -format
$HADOOP_HOME/sbin/start-dfs.sh
$HADOOP_HOME/sbin/start-yarn.sh
```

### Step 3 — Install Python Dependencies

```bash
pip3 install -r requirements.txt
```

### Step 4 — Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 5 — Run Setup Script

```bash
bash scripts/setup_environment.sh
```

---

## 5. Dataset Preparation

### Option A — Synthetic Dataset (Default)

```bash
# Generate 100 000 records
python3 datasets/synthetic/generate_synthetic.py --records 100000

# Preprocess and clean
python3 scripts/preprocess_data.py
```

### Option B — US Accidents Dataset (Kaggle)

1. Download from [Kaggle US-Accidents dataset](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents)
2. Place `US_Accidents_March23.csv` in `datasets/raw/`
3. Run:

```bash
python3 scripts/preprocess_data.py --input datasets/raw/US_Accidents_March23.csv
```

The preprocessed file is saved to `datasets/processed/accidents_clean.csv`.

---

## 6. Starting Services

### Docker

```bash
bash scripts/start_services.sh
# or directly:
docker compose -f docker/docker-compose.yml up -d
```

### Manual

```bash
bash scripts/start_services.sh
```

### Service URLs

| Service            | URL                          |
|--------------------|------------------------------|
| Frontend (React)   | http://localhost:4033         |
| Backend API        | http://localhost:8000         |
| API Documentation  | http://localhost:8000/docs    |
| HDFS NameNode UI   | http://localhost:9870         |
| YARN ResourceMgr   | http://localhost:8088         |

---

## 7. Verifying Everything Works

### Health Checks

```bash
# Backend health
curl http://localhost:8000/api/health
# Expected: {"status":"healthy","records":100000,...}

# Dataset summary
curl http://localhost:8000/api/summary
# Expected: JSON with total_accidents, date_range, states_count, etc.

# MapReduce results
curl "http://localhost:8000/api/analytics/city?limit=10"
```

### HDFS Verification

```bash
# List HDFS directories
hdfs dfs -ls /accidents/

# Check file size
hdfs dfs -du -h /accidents/processed/accidents_clean.csv
```

### Frontend Verification

Open http://localhost:4033 — the dashboard should display charts and a map within 5 seconds of loading.

---

## 8. Troubleshooting

### Port Already in Use

```bash
# Find and kill the process using a port (e.g., 8000)
lsof -ti :8000 | xargs kill -9
lsof -ti :3000 | xargs kill -9
lsof -ti :9870 | xargs kill -9
```

Or change ports in `docker/docker-compose.yml` (left side of `host:container` mapping).

### Docker Memory Issues

**Symptom:** `namenode` container exits immediately or Hadoop is slow.

**Fix:** Increase Docker Desktop memory allocation:
1. Docker Desktop → Settings → Resources → Memory → set to **8 GB minimum**
2. Restart Docker Desktop

### CORS Errors in Browser

**Symptom:** Browser console shows `Access-Control-Allow-Origin` errors.

**Fix:** The backend already has CORS middleware configured. If you see errors in development:
1. Ensure the backend is running on port 8000
2. Ensure `VITE_API_BASE_URL=http://localhost:8000` is set in your `.env`
3. Restart the frontend dev server

### NameNode Safe Mode

**Symptom:** `hdfs dfs -put` fails with "Name node is in safe mode."

**Fix:**
```bash
hdfs dfsadmin -safemode leave
```

### Python Module Not Found

```bash
# Reinstall requirements
pip3 install --upgrade -r requirements.txt

# If using virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Backend `DATA_PATH` Error

**Symptom:** API returns `500 — dataset not found`.

**Fix:** Ensure the dataset is preprocessed before starting the backend:
```bash
python3 datasets/synthetic/generate_synthetic.py --records 100000
python3 scripts/preprocess_data.py
```

### HDFS DataNode Not Connecting

```bash
# Check DataNode logs
docker logs datanode

# Common fix: ensure namenode is fully started before datanode
docker compose -f docker/docker-compose.yml restart datanode
```

### Node.js Build Failures

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```
