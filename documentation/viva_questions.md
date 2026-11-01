# Viva Questions & Answers
## Road Accident Pattern Analysis & Black Spot Identification Using Hadoop

---

## Section 1 — HDFS Architecture & Replication

**Q1. What is HDFS and how is it different from a traditional file system?**

**A:** HDFS (Hadoop Distributed File System) is a distributed, fault-tolerant file system designed to store very large files across a cluster of commodity machines. Key differences from traditional file systems:

- **Block-based storage:** Files are split into large blocks (default 128 MB) distributed across multiple DataNodes.
- **Write-once, read-many:** Optimised for sequential reads of large datasets, not random writes.
- **Fault tolerance:** Each block is replicated (default 3 copies) across different nodes, so data survives hardware failure.
- **Rack-awareness:** Replicas are placed across racks to survive rack-level failures.
- **No local mounting:** Accessed via HDFS API or CLI (`hdfs dfs`), not as a local mountpoint.

In this project, the accident CSV dataset is stored on HDFS at `/accidents/processed/`, making it accessible to all MapReduce jobs running in the cluster without manual copying.

---

**Q2. Explain the roles of NameNode and DataNode in HDFS.**

**A:**

| Component  | Role |
|------------|------|
| **NameNode** | The master node. Maintains the filesystem namespace (directory tree, file-to-block mapping, block locations). Does NOT store actual data. Holds all metadata in RAM. |
| **DataNode** | Worker nodes. Store the actual data blocks on local disk. Report block health to NameNode via heartbeats every 3 seconds. |

**NameNode failure** is critical (single point of failure in classic HDFS). This is why Hadoop 2+ introduced:
- **Secondary NameNode** — periodically checkpoints the edit log (NOT a hot standby)
- **HA NameNode** — active/standby pair with shared edit log (ZooKeeper-coordinated)

In our Docker setup, the `namenode` container hosts the NameNode process and the `datanode` container hosts the DataNode process.

---

**Q3. What is HDFS replication and how does rack-awareness improve fault tolerance?**

**A:** HDFS replication means each data block is stored on multiple DataNodes. The default replication factor is **3**.

The standard replica placement policy:
1. **Replica 1** — on the DataNode where the client is writing (local)
2. **Replica 2** — on a DataNode in a **different rack**
3. **Replica 3** — on a different DataNode in the **same rack as Replica 2**

This means:
- If a single DataNode fails → 2 replicas still available
- If an entire rack fails → at least 1 replica survives (cross-rack replica)
- Network traffic is minimised (replica 3 is on the same rack as replica 2, saving one cross-rack transfer)

For our project with `dfs.replication=1` (pseudo-distributed / Docker single-node mode), we have one copy. In production, we would use 3.

---

**Q4. What happens when a DataNode fails in HDFS?**

**A:**
1. The DataNode stops sending heartbeats to the NameNode.
2. After **10 minutes** (configurable via `dfs.heartbeat.interval` and `dfs.namenode.heartbeat.recheck-interval`), the NameNode marks the DataNode as dead.
3. The NameNode identifies all blocks whose replication count has fallen below the target.
4. It schedules **re-replication** of those under-replicated blocks from surviving DataNodes.
5. The cluster returns to the target replication factor automatically — no manual intervention needed.

---

**Q5. What is the significance of the HDFS block size (128 MB default)?**

**A:** The large block size is a deliberate design choice:
- **Reduces metadata overhead:** Fewer blocks per file → less memory consumed by NameNode.
- **Optimises sequential I/O:** MapReduce jobs read entire blocks sequentially. Large blocks mean fewer disk seeks.
- **Reduces network overhead:** Fewer connections between mappers and DataNodes.

Compare to Linux ext4 (4 KB blocks): a 1 GB file has 256 000 blocks in ext4 but only 8 blocks in HDFS. Storing 250 000 accident records in a single CSV (≈ 50 MB) fits in one HDFS block.

---

## Section 2 — MapReduce Phases

**Q6. Explain the MapReduce programming model with an example from this project.**

**A:** MapReduce decomposes a computation into two user-defined functions:

**Map(key, value) → list(intermediate_key, intermediate_value)**
**Reduce(intermediate_key, list(values)) → output**

Example — **City Accident Count** job in this project:

```
Input line: "2021-03-15,Miami,FL,3,Rain,..."

Map output: ("Miami", 1)

After shuffle/sort: ("Miami", [1, 1, 1, ...])

Reduce output: ("Miami", 847)
```

The framework handles all data distribution, parallelism, and fault recovery between Map and Reduce.

---

**Q7. Describe all phases of MapReduce in detail: Map → Shuffle → Sort → Reduce.**

**A:**

1. **Input Splitting:** The input file is split into InputSplits (usually 1 per HDFS block). Each split is assigned to one Mapper.

2. **Map Phase:**
   - Each Mapper reads its split, applies the user-defined `map()` function.
   - Emits `(key, value)` pairs to an in-memory buffer (default 100 MB).
   - When the buffer is 80% full, it **spills** to disk, sorted by key.

3. **Combiner (optional mini-Reduce):**
   - Runs locally on the mapper's machine before shuffle.
   - Reduces data volume transferred over the network.
   - In our city_count job, the combiner pre-sums counts per city per mapper.

4. **Shuffle (Copy) Phase:**
   - Each Reducer fetches (pulls) its partition of intermediate data from all Mappers.
   - Data is transferred over the network — the most expensive phase.

5. **Sort Phase:**
   - The Reducer merges and sorts all received key-value pairs by key.
   - This produces a globally sorted order for each Reducer's partition.

6. **Reduce Phase:**
   - The user-defined `reduce()` function receives `(key, iterator<values>)`.
   - Emits final output to HDFS.

---

**Q8. What is the role of the Combiner in MapReduce? Does this project use one?**

**A:** The Combiner is an optional optimisation that runs the reduce logic locally on each Mapper node before data is shuffled to Reducers. It reduces the volume of data transferred over the network.

**Conditions for use:** The reduce function must be **commutative and associative** (e.g., sum, min, max). It cannot be used for operations like average (without modification).

In this project:
- **city_count, state_count, hour_count, severity_count, weather_count** — all use summation. A combiner is applicable and reduces network I/O significantly.
- For 100 000 records across 5 cities, a combiner might reduce shuffle data by 90%.

---

**Q9. How does MapReduce handle task failures?**

**A:**
- If a **Map task** fails (JVM crash, node failure), the ApplicationMaster reschedules it on a different node. The input split is re-read from HDFS (data is replicated, so it's still available).
- If a **Reduce task** fails, it is rescheduled. Reducers must re-fetch intermediate data from mappers.
- A task that fails more than `mapreduce.map.maxattempts` (default: 4) times causes the job to fail.
- **Speculative execution:** If a task is running significantly slower than peers, Hadoop can launch a duplicate speculative task and use whichever finishes first.

---

## Section 3 — Hive vs Traditional SQL

**Q10. What is Apache Hive and how does it differ from a traditional RDBMS like MySQL?**

**A:**

| Feature | Apache Hive | MySQL (RDBMS) |
|---------|-------------|---------------|
| Storage | HDFS (distributed) | Local disk / NFS |
| Processing | MapReduce / Tez / Spark | In-process SQL engine |
| Schema | Schema-on-read | Schema-on-write |
| Data format | CSV, ORC, Parquet, JSON | Row-based tables |
| Latency | Minutes (batch) | Milliseconds (OLTP) |
| Scalability | Petabytes across hundreds of nodes | Vertical scaling, TB range |
| Transactions | Limited (ACID in ORC with Hive 3) | Full ACID |
| Use case | Batch analytics, data warehouse | OLTP, transactional systems |

Hive translates HiveQL queries into MapReduce/Tez/Spark jobs that execute on the cluster. It is NOT suitable for real-time queries.

---

**Q11. What is schema-on-read in Hive? Why is it useful for this project?**

**A:** In schema-on-read, the schema (column definitions, data types) is applied **when data is read**, not when it is written. The raw data on HDFS is just bytes (e.g., CSV rows).

Benefits for this project:
- We can store the raw accident CSV on HDFS without any ETL.
- We define an **external Hive table** over the CSV and immediately query it.
- Multiple tables with different schemas can point to the same HDFS data.
- If the source data format changes, we update the table definition, not the stored data.

Example Hive DDL used in this project:

```sql
CREATE EXTERNAL TABLE accidents (
    accident_id STRING, severity INT, city STRING,
    state STRING, start_lat DOUBLE, start_lng DOUBLE,
    weather_condition STRING, start_time TIMESTAMP
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/accidents/processed/';
```

---

**Q12. Write a Hive query to find the top 10 most dangerous cities by accident count.**

**A:**

```sql
SELECT city, COUNT(*) AS accident_count
FROM accidents
GROUP BY city
ORDER BY accident_count DESC
LIMIT 10;
```

Hive compiles this into a MapReduce job:
- **Map:** Emit `(city, 1)` for each row.
- **Reduce:** Sum counts per city (GROUP BY).
- A second MR job performs the global ORDER BY and LIMIT.

For better performance, this can be run with **Tez** (set `hive.execution.engine=tez`) which uses a DAG instead of multiple sequential MR jobs.

---

## Section 4 — Pig Latin Basics

**Q13. What is Apache Pig and when would you use it over MapReduce?**

**A:** Apache Pig is a high-level data flow language (Pig Latin) that compiles to MapReduce jobs. It abstracts the low-level Java MapReduce API.

**Use Pig over raw MapReduce when:**
- The transformation is complex (multi-step joins, filters, aggregations) and writing Java MapReduce would be verbose.
- You need rapid prototyping — Pig Latin scripts are much shorter than equivalent Java code.
- You need built-in operators like `JOIN`, `GROUP`, `FILTER`, `ORDER`, `DISTINCT`.

**Pig vs Hive:**
- Pig is procedural (step-by-step data flow); Hive is declarative (SQL-like).
- Pig is better for complex data transformations; Hive is better for ad-hoc analytics.

---

**Q14. Write a Pig Latin script to find the top 5 states by accident severity.**

**A:**

```pig
-- Load data from HDFS
accidents = LOAD '/accidents/processed/accidents_clean.csv'
    USING PigStorage(',')
    AS (id:chararray, severity:int, city:chararray, state:chararray,
        lat:double, lng:double, weather:chararray);

-- Filter out header row and null severities
filtered = FILTER accidents BY severity IS NOT NULL AND id != 'ID';

-- Group by state
by_state = GROUP filtered BY state;

-- Calculate total severity score per state
state_severity = FOREACH by_state GENERATE
    group AS state,
    SUM(filtered.severity) AS total_severity,
    COUNT(filtered) AS accident_count;

-- Sort descending
sorted = ORDER state_severity BY total_severity DESC;

-- Take top 5
top5 = LIMIT sorted 5;

-- Store result
STORE top5 INTO '/accidents/results/pig/top_states_severity'
    USING PigStorage(',');
```

---

## Section 5 — Spark vs MapReduce Performance

**Q15. Why is Apache Spark faster than MapReduce for iterative algorithms?**

**A:** The key difference is **in-memory computation**:

| Aspect | MapReduce | Spark |
|--------|-----------|-------|
| Intermediate storage | Writes to HDFS after each step | Keeps in RAM (RDD/DataFrame) |
| Iterative algorithms | Reads/writes HDFS each iteration | Reuses in-memory RDD |
| Startup overhead | High (new JVM per job) | Lower (long-running executor) |
| API | Java/Python verbose | Concise (DataFrame, SQL) |
| Streaming | Not native | Structured Streaming |

For a K-means clustering on accident locations (iterative algorithm):
- **MapReduce:** Each of 100 iterations reads/writes HDFS → 200 HDFS I/O operations.
- **Spark:** Data loaded to RAM once, 100 in-memory iterations → ~10-100× faster.

In this project's black spot clustering, Spark would be the preferred engine over MapReduce.

---

**Q16. What are RDDs and DataFrames in Spark?**

**A:**

- **RDD (Resilient Distributed Dataset):** The foundational abstraction. An immutable, partitioned collection of records distributed across the cluster. Supports transformations (lazy, e.g., `map`, `filter`) and actions (eager, e.g., `count`, `collect`). Type-safe but verbose.

- **DataFrame:** A higher-level abstraction built on RDDs, organised into named columns (like a table). Uses the Catalyst query optimiser to generate efficient execution plans. Preferred for structured data like our accident CSV.

- **Dataset:** A typed DataFrame available in Scala/Java (not Python).

For this project, loading the accident CSV as a Spark DataFrame:

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("AccidentAnalysis").getOrCreate()
df = spark.read.csv("/accidents/processed/accidents_clean.csv", header=True, inferSchema=True)
black_spots = df.groupBy("city").agg({"severity": "avg", "id": "count"}).filter("count(id) > 50")
```

---

## Section 6 — YARN Resource Management

**Q17. What is YARN and what problem does it solve?**

**A:** YARN (Yet Another Resource Negotiator) is the cluster resource management layer introduced in Hadoop 2. It separates resource management from MapReduce programming logic.

**Problem in Hadoop 1:** The JobTracker handled both cluster resource management AND MapReduce job scheduling. This created:
- A single point of failure (JobTracker crash = entire cluster down)
- Inability to run non-MapReduce workloads (Spark, Hive on Tez, etc.)
- Poor scalability (JobTracker memory limited to ~4000 nodes)

**YARN solution:**
- **ResourceManager:** Global cluster resource allocator (replaces JobTracker's resource role)
- **NodeManager:** Per-node agent managing containers (replaces TaskTracker)
- **ApplicationMaster:** Per-application scheduler (handles job-specific logic)

This allows Spark, Hive (Tez), MapReduce, and Flink to all run simultaneously on the same Hadoop cluster.

---

**Q18. Explain the YARN application submission lifecycle.**

**A:**

1. **Client submits application** to ResourceManager (RM).
2. **RM allocates a container** on a NodeManager (NM) for the ApplicationMaster (AM).
3. **AM starts** and registers with RM.
4. **AM requests containers** from RM (specifying CPU, memory requirements).
5. **RM allocates containers** on NodeManagers based on available resources and scheduling policy.
6. **AM launches tasks** in the allocated containers (map/reduce tasks or Spark executors).
7. **Tasks execute** and report progress to AM.
8. On completion, **AM reports success** to RM and releases containers.
9. RM records job history.

---

## Section 7 — Black Spot Identification Methodology

**Q19. What is a road accident "black spot" and how does this project identify them?**

**A:** A black spot (also called a hazardous location) is a road location with a statistically higher frequency and/or severity of accidents compared to similar road segments.

**This project's methodology:**

1. **Frequency-based identification:** Locations (GPS coordinates) with accident counts exceeding a threshold (e.g., > 50 accidents in the dataset) are flagged.

2. **Severity-weighted scoring:**
   ```
   Black Spot Score = (Count × AvgSeverity × RecentWeight)
   ```
   where `RecentWeight` gives higher weight to recent accidents.

3. **Spatial clustering (DBSCAN/Grid):** Group GPS coordinates into clusters. Clusters with high density and severity are black spots.

4. **MapReduce implementation:**
   - **Mapper:** Emit `(grid_cell, (severity, 1))` where `grid_cell` is derived by rounding lat/lng to 3 decimal places (~100m grid).
   - **Reducer:** Sum counts and severity per cell; emit cells exceeding threshold.

5. **Output:** Ranked list of black spot locations with coordinates, accident count, and severity score — displayed on the frontend map.

---

**Q20. How do you determine the threshold for black spot classification?**

**A:** Threshold selection approaches used in this project:

1. **Statistical approach:** A location is a black spot if its accident rate is more than **2 standard deviations above the mean** rate for all locations. This is data-driven and adapts to dataset size.

2. **Absolute threshold:** For simplicity (and the demo dataset), we use `count > 50` accidents per grid cell. This is configurable via the API parameter.

3. **Severity-weighted:** Even with fewer accidents, a location is flagged if `SUM(severity) > severity_threshold`, catching intersections with infrequent but catastrophic accidents.

4. **Time-adjusted:** Accidents from the last 2 years are weighted 2× more than older ones, prioritising currently dangerous locations.

In production (e.g., national road safety authority), the threshold would be set using accident rate per million vehicle kilometres travelled (MVKT), normalized for traffic volume.

---

## Section 8 — Project-Specific Analytics

**Q21. What analytics does this project perform? List all MapReduce jobs and their outputs.**

**A:** The project runs 5 core MapReduce jobs:

| Job | Input | Output | Use Case |
|-----|-------|--------|----------|
| `city_count` | Full CSV | `(city, count)` | Identify highest-accident cities |
| `state_count` | Full CSV | `(state, count)` | State-level accident distribution |
| `hour_count` | Full CSV | `(hour_of_day, count)` | Peak accident time analysis |
| `severity_count` | Full CSV | `(severity_level, count)` | Severity distribution |
| `weather_count` | Full CSV | `(weather_condition, count)` | Weather impact analysis |

Additional analytics via Hive/SQL:
- Monthly/yearly trend analysis
- Top 10 black spot locations (by frequency and severity score)
- Weather × severity correlation matrix
- Day-of-week accident patterns
- Accident duration analysis

---

**Q22. How does the frontend visualise the analytics results?**

**A:** The React frontend fetches data from the FastAPI backend via REST API calls and renders:

1. **Summary cards:** Total accidents, date range, severity breakdown (fetched from `/api/summary`)
2. **Bar charts (Recharts library):** Top 10 cities, states, weather conditions
3. **Line chart:** Monthly accident trends
4. **Pie/donut chart:** Severity distribution (1=Minor, 2=Moderate, 3=Serious, 4=Fatal)
5. **Heatmap:** Hour-of-day × day-of-week accident density
6. **Interactive map (Leaflet.js):** Accident locations as markers; black spots as red circle overlays with intensity proportional to score
7. **Data table:** Paginated accident records with search/filter

Data flow: HDFS results → FastAPI reads CSV/JSON → REST API → React state → Recharts/Leaflet renders

---

## Section 9 — Scalability

**Q23. How would this system scale to handle billions of accident records?**

**A:** Scaling from 100 000 to billions of records requires changes at every layer:

**Storage (HDFS):**
- Increase block size to 256 MB for very large files
- Use **ORC or Parquet** columnar formats instead of CSV (10× compression, predicate pushdown)
- Increase replication factor to 3 for production reliability
- Partition data by year/state: `/accidents/processed/year=2023/state=CA/`

**Processing (MapReduce/Spark):**
- Increase cluster size (100+ nodes)
- Use **Spark** instead of MapReduce (in-memory, 10-100× faster)
- Enable **speculative execution** to handle straggler tasks
- Use **broadcast joins** in Spark for small lookup tables (weather codes, state names)

**Hive optimisations:**
- Partition tables by date and state
- Use **ORC with ZLIB compression**
- Enable **vectorised query execution** (`hive.vectorized.execution.enabled=true`)
- Use **Tez** execution engine instead of MapReduce

**API/Backend:**
- Cache MapReduce results in Redis
- Serve pre-aggregated results (not raw records) to the frontend
- Use async FastAPI endpoints with connection pooling

**Infrastructure:**
- Deploy on **AWS EMR** or **Google Dataproc** for auto-scaling clusters
- Use **S3/GCS** instead of local HDFS for elastic storage

---

**Q24. What is data partitioning in HDFS and Hive, and why does it matter for performance?**

**A:** Partitioning organises data into subdirectories based on column values, allowing queries to skip irrelevant data entirely.

**HDFS partitioning:**
```
/accidents/processed/year=2021/state=CA/accidents.csv
/accidents/processed/year=2021/state=TX/accidents.csv
/accidents/processed/year=2022/state=CA/accidents.csv
```

**Hive partitioned table:**
```sql
CREATE TABLE accidents_partitioned (
    id STRING, severity INT, city STRING, lat DOUBLE, lng DOUBLE
)
PARTITIONED BY (year INT, state STRING)
STORED AS ORC;
```

**Performance impact:**
- Query `WHERE year=2022 AND state=CA` reads only 1 partition instead of all files.
- For 1 billion records split across 50 states × 10 years = 500 partitions, a state+year query reads 1/500 of the data.
- This is called **partition pruning**.

---

## Section 10 — Data Quality & Preprocessing

**Q25. What data quality issues exist in road accident datasets and how does this project handle them?**

**A:** Common issues found in the US Accidents dataset (and handled in `preprocess_data.py`):

| Issue | Detection | Fix |
|-------|-----------|-----|
| Missing lat/lng | `isnull()` check | Drop row (cannot geolocate) |
| Invalid coordinates | `lat` outside ±90, `lng` outside ±180 | Drop row |
| Missing severity | `isnull()` | Impute with mode (most common value) |
| Future dates | `start_time > now()` | Drop row |
| Duplicate accident IDs | `duplicated('ID')` | Keep first occurrence |
| Inconsistent city names | "Los Angeles" vs "los angeles" | `.str.title()` normalisation |
| Missing weather condition | `isnull()` | Impute with "Unknown" |
| Outlier duration | Accident duration > 24 hours | Cap at 24 hours |

The cleaned data is saved to `datasets/processed/accidents_clean.csv` with a preprocessing report logged.

---

**Q26. What is the difference between structured, semi-structured, and unstructured data in the context of this project?**

**A:**

- **Structured data (used in this project):** CSV with defined columns — `ID, Severity, City, State, Lat, Lng, Weather`. Stored in HDFS, queried with Hive SQL and MapReduce.

- **Semi-structured data (potential extension):** JSON/XML feeds from traffic sensors, weather APIs. Has schema but variable or nested structure. Processed with Pig Latin or Spark (which handles nested JSON natively).

- **Unstructured data (future extension):** Dashcam footage, police accident reports (text). Requires ML/NLP for information extraction before it can be stored as structured data.

Hadoop/HDFS can store all three types; the processing framework determines how each is interpreted.

---

**Q27. Why is the dataset stored as CSV and not in a database like PostgreSQL?**

**A:** CSV on HDFS is chosen because:

1. **Volume:** The dataset could contain millions to hundreds of millions of records — beyond the practical range of a single PostgreSQL instance.
2. **Batch processing:** MapReduce and Hive are designed for full-scan analytics over CSV/ORC/Parquet, not point lookups.
3. **Portability:** CSV is universal and requires no schema migration when the data evolves.
4. **Cost:** HDFS on commodity hardware is far cheaper per GB than RDBMS storage with indexing.
5. **Tool compatibility:** All Hadoop ecosystem tools (MapReduce, Hive, Pig, Spark) read CSV/Parquet directly from HDFS.

For the frontend API serving individual accident lookups, the preprocessed CSV is loaded into a pandas DataFrame in memory — effectively a lightweight in-process database sufficient for 100 000 records.

---

**Q28. Explain the preprocessing pipeline in this project.**

**A:** The preprocessing pipeline in `scripts/preprocess_data.py`:

```
Raw CSV (datasets/raw/)
    ↓
1. Load with pandas (chunked for large files)
    ↓
2. Drop duplicates (ID column)
    ↓
3. Drop rows with missing lat/lng
    ↓
4. Validate coordinate ranges
    ↓
5. Normalise city/state strings (.str.title(), .str.strip())
    ↓
6. Parse datetime columns
    ↓
7. Derive features:
   - hour_of_day (0–23)
   - day_of_week (0–6)
   - month (1–12)
   - year
    ↓
8. Fill missing weather with "Unknown"
    ↓
9. Cap outlier durations
    ↓
Clean CSV (datasets/processed/accidents_clean.csv)
    ↓
Upload to HDFS → MapReduce jobs → API → Frontend
```

---

**Q29. How does the Hadoop ecosystem tools compare in terms of abstraction level?**

**A:** From lowest to highest abstraction:

```
Hardware (servers, disks, network)
    ↓ HDFS — distributed storage
    ↓ YARN — resource management
    ↓ MapReduce — low-level programming model (Java/Python streaming)
    ↓ Pig Latin — procedural data flow language (compiles to MR)
    ↓ Hive HQL — SQL-like declarative language (compiles to MR/Tez)
    ↓ Spark DataFrames — in-memory distributed computation with SQL support
    ↓ FastAPI backend — REST API layer consuming results
    ↓ React frontend — user-facing visualisation
```

In this project, **all levels from HDFS to React** are implemented, giving a complete end-to-end big data pipeline.

---

**Q30. What are the limitations of this project and how could it be improved for real-world deployment?**

**A:**

| Limitation | Real-World Improvement |
|-----------|------------------------|
| Static CSV dataset | Stream live accident reports via Apache Kafka into HDFS |
| Single DataNode (Docker) | Multi-node cluster (AWS EMR / GCP Dataproc) with replication=3 |
| No real-time alerts | Spark Structured Streaming for real-time black spot detection |
| Basic black spot algorithm | ML clustering (DBSCAN with KD-tree) on Spark MLlib |
| No user auth on API | OAuth2 / JWT authentication on FastAPI |
| CSV storage | ORC/Parquet with Hive partitioning for 100× query speedup |
| No traffic volume data | Normalize accident rates by vehicle-kilometres-travelled (MVKT) |
| Single-region deployment | Multi-region HDFS federation for disaster recovery |
| Pandas in-memory API | Apache HBase or Elasticsearch for fast record lookups |
| Manual data refresh | Airflow DAG for automated daily pipeline orchestration |

Despite these limitations, the project demonstrates the complete Hadoop ecosystem (HDFS, MapReduce, Hive, Pig, YARN) with a production-style React + FastAPI frontend, making it a comprehensive proof-of-concept for big data accident analytics.
