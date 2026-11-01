import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

class Settings:
    DATA_PATH: str = os.path.join(PROJECT_ROOT, "datasets", "processed", "accidents_clean.csv")
    RAW_DATA_PATH: str = os.path.join(PROJECT_ROOT, "datasets", "raw")
    HADOOP_HOME: str = os.environ.get("HADOOP_HOME", "/opt/hadoop")
    HIVE_HOME: str = os.environ.get("HIVE_HOME", "/opt/hive")
    PIG_HOME: str = os.environ.get("PIG_HOME", "/opt/pig")
    SPARK_HOME: str = os.environ.get("SPARK_HOME", "/opt/spark")
    HADOOP_SCRIPTS_DIR: str = os.path.join(PROJECT_ROOT, "hadoop")
    CORS_ORIGINS: list = ["http://localhost:4033", "http://localhost:5173", "http://127.0.0.1:4033"]

settings = Settings()
