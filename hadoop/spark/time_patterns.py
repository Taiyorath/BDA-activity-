#!/usr/bin/env python3
"""
PySpark Job: Time Patterns Analysis
Analyses accident distribution by Hour-of-Day and Day-of-Week.
Output: JSON to hdfs:///accidents/results/spark/time_patterns/
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, avg, round as spark_round, desc
)

def main():
    spark = SparkSession.builder \
        .appName("TimePatterns") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    # Read cleaned processed CSV from HDFS
    df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

    # ── Hour-of-Day Distribution ───────────────────────────────────
    hourly = (
        df.filter(col("Hour").isNotNull())
          .withColumn("Hour", col("Hour").cast("int"))
          .groupBy("Hour")
          .agg(
              count("*").alias("accident_count"),
              spark_round(avg(col("Severity").cast("double")), 2).alias("avg_severity")
          )
          .orderBy("Hour")
    )

    print("\n=== Hourly Distribution ===")
    hourly.show(24, truncate=False)

    hourly.write.mode("overwrite").json(
        "hdfs:///accidents/results/spark/time_patterns/hourly/"
    )

    # ── Day-of-Week Distribution ───────────────────────────────────
    daily = (
        df.filter(col("Day_of_Week").isNotNull())
          .groupBy("Day_of_Week")
          .agg(
              count("*").alias("accident_count"),
              spark_round(avg(col("Severity").cast("double")), 2).alias("avg_severity")
          )
          .orderBy(desc("accident_count"))
    )

    print("\n=== Day-of-Week Distribution ===")
    daily.show(7, truncate=False)

    daily.write.mode("overwrite").json(
        "hdfs:///accidents/results/spark/time_patterns/daily/"
    )

    print("[DONE] TimePatterns job complete.")
    spark.stop()

if __name__ == "__main__":
    main()
