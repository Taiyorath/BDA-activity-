from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import shutil
import subprocess
import os
import datetime
import aiofiles
import app.main as main_module
from app.config import settings

router = APIRouter()

# In-memory job list
_jobs: list = []

# ─── Allowed job names ────────────────────────────────────────────────────────
ALLOWED_MAPREDUCE_JOBS = {"city_count", "state_count", "hour_count", "severity_count", "weather_count"}
ALLOWED_HIVE_QUERIES = {
    "accidents_by_state", "accidents_by_city", "hourly_distribution",
    "severity_distribution", "weather_analysis", "monthly_trends",
    "yearly_stats", "severe_locations",
}
ALLOWED_PIG_SCRIPTS = {"clean_accidents", "location_stats", "severity_filter"}
ALLOWED_SPARK_JOBS = {
    "accident_frequency", "severity_analysis", "monthly_trends",
    "weather_analysis", "location_stats", "time_patterns",
}

# ─── Helper utilities ─────────────────────────────────────────────────────────

def _tool_available(name: str) -> bool:
    return shutil.which(name) is not None


def _sim_note() -> str:
    return "[SIMULATED OUTPUT] Hadoop not detected in environment"


def _add_job(job_type: str, job_name: str, status: str, output: str) -> dict:
    job = {
        "id": len(_jobs) + 1,
        "type": job_type,
        "name": job_name,
        "status": status,
        "submitted_at": datetime.datetime.utcnow().isoformat() + "Z",
        "output": output,
    }
    _jobs.append(job)
    return job


def _top_cities_from_df(n: int = 10) -> list[str]:
    df = main_module.df
    if df is None or len(df) == 0:
        return []
    city_col = next((c for c in ["City", "city"] if c in df.columns), None)
    if city_col is None:
        return []
    top = df[city_col].dropna().value_counts().head(n)
    return [f"{city}\t{int(count)}" for city, count in top.items()]


# ─── Pydantic request bodies ──────────────────────────────────────────────────

class MapReduceRequest(BaseModel):
    job: str


class HiveRequest(BaseModel):
    query_name: str


class PigRequest(BaseModel):
    script: str


class SparkRequest(BaseModel):
    job: str


# ─── HDFS endpoint ────────────────────────────────────────────────────────────

@router.get("/hdfs")
def hdfs_listing():
    if _tool_available("hdfs"):
        try:
            result = subprocess.run(
                ["hdfs", "dfs", "-ls", "-R", "/accidents"],
                capture_output=True, text=True, timeout=60,
            )
            return {
                "simulated": False,
                "output": result.stdout or result.stderr,
            }
        except Exception as e:
            pass  # fall through to simulated

    return {
        "simulated": True,
        "note": _sim_note(),
        "directories": [
            {
                "path": "/accidents/raw",
                "files": [
                    {"name": "synthetic_accidents.csv", "size": "48.2 MB", "modified": "2024-01-15"}
                ],
            },
            {
                "path": "/accidents/processed",
                "files": [
                    {"name": "accidents_clean.csv", "size": "32.1 MB", "modified": "2024-01-15"}
                ],
            },
            {
                "path": "/accidents/results",
                "files": [],
            },
        ],
    }


# ─── Upload endpoint ──────────────────────────────────────────────────────────

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs(settings.RAW_DATA_PATH, exist_ok=True)
    dest = os.path.join(settings.RAW_DATA_PATH, file.filename)
    async with aiofiles.open(dest, "wb") as out:
        content = await file.read()
        await out.write(content)
    size_kb = round(os.path.getsize(dest) / 1024, 2)
    return {
        "filename": file.filename,
        "saved_to": dest,
        "size_kb": size_kb,
        "status": "uploaded",
    }


# ─── MapReduce endpoint ───────────────────────────────────────────────────────

@router.post("/mapreduce/run")
def run_mapreduce(req: MapReduceRequest):
    if req.job not in ALLOWED_MAPREDUCE_JOBS:
        raise HTTPException(status_code=400, detail=f"Unknown job '{req.job}'. Allowed: {sorted(ALLOWED_MAPREDUCE_JOBS)}")

    if _tool_available("hadoop"):
        script_dir = settings.HADOOP_SCRIPTS_DIR
        mapper = os.path.join(script_dir, "mapreduce", f"{req.job}_mapper.py")
        reducer = os.path.join(script_dir, "mapreduce", f"{req.job}_reducer.py")
        if os.path.exists(mapper) and os.path.exists(reducer):
            try:
                cmd = [
                    "hadoop", "jar",
                    os.path.join(settings.HADOOP_HOME, "share/hadoop/tools/lib/hadoop-streaming-*.jar"),
                    "-mapper", mapper, "-reducer", reducer,
                    "-input", "/accidents/processed/accidents_clean.csv",
                    "-output", f"/accidents/results/{req.job}_{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
                ]
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                output = result.stdout or result.stderr
                status = "completed" if result.returncode == 0 else "failed"
                job = _add_job("mapreduce", req.job, status, output)
                return {"simulated": False, "job": job}
            except Exception as e:
                pass  # fall through

    # Simulated output
    if req.job == "city_count":
        lines = _top_cities_from_df(10)
        sim_output = "\n".join(lines) if lines else (
            "Los Angeles\t4521\nHouston\t3892\nChicago\t3104\n"
            "Phoenix\t2876\nPhiladelphia\t2543\nSan Antonio\t2210\n"
            "San Diego\t2087\nDallas\t1998\nSan Jose\t1876\nAustin\t1754"
        )
    elif req.job == "state_count":
        sim_output = (
            "CA\t18432\nTX\t15872\nFL\t14203\nNY\t11034\n"
            "PA\t9821\nIL\t8976\nOH\t8321\nGA\t7654\nNC\t7123\nMI\t6987"
        )
    elif req.job == "hour_count":
        sim_output = "\n".join(f"{h:02d}\t{max(500, int(3000 * abs(((h-8)%24)/12 - 0.5) * 2 + 500))}" for h in range(24))
    elif req.job == "severity_count":
        sim_output = "1\t12543\n2\t45231\n3\t28764\n4\t8932"
    elif req.job == "weather_count":
        sim_output = (
            "Clear\t42310\nCloudy\t18432\nRain\t14203\n"
            "Light Rain\t9821\nFog\t5432\nSnow\t3210\nThunderstorm\t1987"
        )
    else:
        sim_output = f"Simulated output for job: {req.job}"

    job = _add_job("mapreduce", req.job, "completed", sim_output)
    return {
        "simulated": True,
        "note": _sim_note(),
        "job": job,
    }


# ─── Hive endpoint ────────────────────────────────────────────────────────────

@router.post("/hive/execute")
def execute_hive(req: HiveRequest):
    if req.query_name not in ALLOWED_HIVE_QUERIES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown query '{req.query_name}'. Allowed: {sorted(ALLOWED_HIVE_QUERIES)}",
        )

    hql_path = os.path.join(settings.HADOOP_SCRIPTS_DIR, "hive", f"{req.query_name}.hql")

    if _tool_available("hive") and os.path.exists(hql_path):
        try:
            result = subprocess.run(
                ["hive", "-f", hql_path],
                capture_output=True, text=True, timeout=60,
            )
            output = result.stdout or result.stderr
            status = "completed" if result.returncode == 0 else "failed"
            job = _add_job("hive", req.query_name, status, output)
            return {"simulated": False, "job": job}
        except Exception:
            pass

    # Read HQL content if available for display
    hql_content = ""
    if os.path.exists(hql_path):
        try:
            with open(hql_path) as f:
                hql_content = f.read()
        except Exception:
            pass

    sim_outputs = {
        "accidents_by_state": "state\taccidents\nCA\t18432\nTX\t15872\nFL\t14203\nNY\t11034\nPA\t9821",
        "accidents_by_city": "city\taccidents\nLos Angeles\t4521\nHouston\t3892\nChicago\t3104",
        "hourly_distribution": "\n".join(f"{h:02d}:00\t{abs(int(3000*((h-8)/12)))+500}" for h in range(24)),
        "severity_distribution": "severity\tcount\n1\t12543\n2\t45231\n3\t28764\n4\t8932",
        "weather_analysis": "weather\tcount\nClear\t42310\nCloudy\t18432\nRain\t14203",
        "monthly_trends": "\n".join(f"2024-{m:02d}\t{int(8000 + 1000 * ((m-6)**2/12))}" for m in range(1,13)),
        "yearly_stats": "year\tcount\n2020\t45231\n2021\t52340\n2022\t49876\n2023\t54123\n2024\t28764",
        "severe_locations": "city\tstate\tsevere_count\nLos Angeles\tCA\t532\nHouston\tTX\t487\nChicago\tIL\t421",
    }
    sim_output = sim_outputs.get(req.query_name, f"Simulated result for {req.query_name}")

    job = _add_job("hive", req.query_name, "completed", sim_output)
    return {
        "simulated": True,
        "note": _sim_note(),
        "query_content": hql_content,
        "job": job,
    }


# ─── Pig endpoint ─────────────────────────────────────────────────────────────

@router.post("/pig/run")
def run_pig(req: PigRequest):
    if req.script not in ALLOWED_PIG_SCRIPTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown script '{req.script}'. Allowed: {sorted(ALLOWED_PIG_SCRIPTS)}",
        )

    pig_path = os.path.join(settings.HADOOP_SCRIPTS_DIR, "pig", f"{req.script}.pig")

    if _tool_available("pig") and os.path.exists(pig_path):
        try:
            result = subprocess.run(
                ["pig", "-f", pig_path],
                capture_output=True, text=True, timeout=60,
            )
            output = result.stdout or result.stderr
            status = "completed" if result.returncode == 0 else "failed"
            job = _add_job("pig", req.script, status, output)
            return {"simulated": False, "job": job}
        except Exception:
            pass

    pig_content = ""
    if os.path.exists(pig_path):
        try:
            with open(pig_path) as f:
                pig_content = f.read()
        except Exception:
            pass

    sim_outputs = {
        "clean_accidents": (
            "Input records: 95470\nRecords after null-lat/lng filter: 95031\n"
            "Records after dedup: 94876\nOutput written to: /accidents/processed/accidents_clean.csv"
        ),
        "location_stats": (
            "Top 5 locations by accident count:\n"
            "Los Angeles, CA -> 4521\nHouston, TX -> 3892\n"
            "Chicago, IL -> 3104\nPhoenix, AZ -> 2876\nPhiladelphia, PA -> 2543"
        ),
        "severity_filter": (
            "Severity 4 records: 8932\nSeverity 3 records: 28764\n"
            "Written to /accidents/results/severe_accidents.csv"
        ),
    }
    sim_output = sim_outputs.get(req.script, f"Simulated Pig output for {req.script}")

    job = _add_job("pig", req.script, "completed", sim_output)
    return {
        "simulated": True,
        "note": _sim_note(),
        "script_content": pig_content,
        "job": job,
    }


# ─── Spark endpoint ───────────────────────────────────────────────────────────

@router.post("/spark/run")
def run_spark(req: SparkRequest):
    if req.job not in ALLOWED_SPARK_JOBS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown job '{req.job}'. Allowed: {sorted(ALLOWED_SPARK_JOBS)}",
        )

    spark_script = os.path.join(settings.HADOOP_SCRIPTS_DIR, "spark", f"{req.job}.py")

    if _tool_available("spark-submit") and os.path.exists(spark_script):
        try:
            result = subprocess.run(
                ["spark-submit", spark_script],
                capture_output=True, text=True, timeout=60,
            )
            output = result.stdout or result.stderr
            status = "completed" if result.returncode == 0 else "failed"
            job = _add_job("spark", req.job, status, output)
            return {"simulated": False, "job": job}
        except Exception:
            pass

    sim_outputs = {
        "accident_frequency": (
            "Accident Frequency by City (Top 10):\n"
            "Los Angeles: 4521\nHouston: 3892\nChicago: 3104\n"
            "Phoenix: 2876\nPhiladelphia: 2543\nSan Antonio: 2210\n"
            "San Diego: 2087\nDallas: 1998\nSan Jose: 1876\nAustin: 1754"
        ),
        "severity_analysis": (
            "Severity Distribution:\nLevel 1 (Minor): 12,543 (13.1%)\n"
            "Level 2 (Moderate): 45,231 (47.4%)\n"
            "Level 3 (Serious): 28,764 (30.1%)\n"
            "Level 4 (Fatal): 8,932 (9.4%)\nAverage Severity: 2.36"
        ),
        "monthly_trends": (
            "Monthly Trend Analysis:\n" +
            "\n".join(f"2024-{m:02d}: {int(7000 + 1500*(abs(m-7)/6))}" for m in range(1,13))
        ),
        "weather_analysis": (
            "Accidents by Weather:\nClear: 42,310 (44.3%)\nCloudy: 18,432 (19.3%)\n"
            "Rain: 14,203 (14.9%)\nLight Rain: 9,821 (10.3%)\nFog: 5,432 (5.7%)"
        ),
        "location_stats": (
            "Grid Cell Statistics:\nTotal cells with accidents: 8,432\n"
            "High-density cells (>50 accidents): 1,243\nMax accidents in single cell: 892\n"
            "Mean accidents per cell: 11.3"
        ),
        "time_patterns": (
            "Peak Hours: 07:00-09:00 (Morning Rush), 16:00-18:00 (Evening Rush)\n"
            "Peak Days: Friday (15.2%), Thursday (14.8%), Wednesday (14.5%)\n"
            "Peak Months: December (9.8%), January (9.4%), November (8.9%)"
        ),
    }
    sim_output = sim_outputs.get(req.job, f"Simulated Spark output for {req.job}")

    job = _add_job("spark", req.job, "completed", sim_output)
    return {
        "simulated": True,
        "note": _sim_note(),
        "job": job,
    }


# ─── Jobs list endpoint ───────────────────────────────────────────────────────

@router.get("/jobs")
def list_jobs():
    return list(reversed(_jobs))  # most recent first


# ─── YARN endpoint ────────────────────────────────────────────────────────────

@router.get("/yarn")
def yarn_status():
    if _tool_available("yarn"):
        try:
            result = subprocess.run(
                ["yarn", "node", "-list"],
                capture_output=True, text=True, timeout=60,
            )
            return {"simulated": False, "output": result.stdout or result.stderr}
        except Exception:
            pass

    return {
        "simulated": True,
        "note": _sim_note(),
        "cluster": {
            "nodes": 3,
            "active_nodes": 3,
            "lost_nodes": 0,
            "total_memory_mb": 24576,
            "used_memory_mb": 8192,
            "total_vcores": 12,
            "used_vcores": 4,
        },
        "running_applications": [
            {
                "id": "application_1704067200_0001",
                "name": "Road Accident MapReduce",
                "state": "FINISHED",
                "final_status": "SUCCEEDED",
                "progress": "100%",
                "elapsed": "00:02:34",
            }
        ],
    }
