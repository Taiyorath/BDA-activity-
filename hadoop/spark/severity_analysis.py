#!/usr/bin/env python3
"""
PySpark Job: Severity Analysis by Severity Label and State
Reads cleaned accidents from HDFS and produces severity breakdown per state.
Output: JSON to hdfs:///accidents/results/spark/severity_analysis/
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, round as spark_round, desc

def main():
    spark = SparkSession.builder \
        .appName("SeverityAnalysis") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    # Read cleaned processed CSV from HDFS
    df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

    # Group by Severity_Label and State
    result = (
        df.groupBy("Severity_Label", "State")
          .agg(
              count("*").alias("accident_count"),
              spark_round(avg(col("Severity").cast("double")), 2).alias("avg_severity")
          )
          .orderBy(desc("accident_count"))
    )

    result.show(30, truncate=False)

    # Write results as JSON to HDFS
    result.write.mode("overwrite").json("hdfs:///accidents/results/spark/severity_analysis/")

    print("[DONE] SeverityAnalysis job complete.")
    spark.stop()

if __name__ == "__main__":
    main()
