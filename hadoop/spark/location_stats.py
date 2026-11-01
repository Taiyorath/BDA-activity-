#!/usr/bin/env python3
"""
PySpark Job: Location Statistics — Top Accident Density Spots
Identifies top locations with highest accident density (black spots).
Output: JSON to hdfs:///accidents/results/spark/location_stats/
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, avg, round as spark_round, desc
)

def main():
    spark = SparkSession.builder \
        .appName("LocationStats") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    # Read cleaned processed CSV from HDFS
    df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

    # Group by City + State, compute stats
    result = (
        df.filter(col("City").isNotNull() & col("State").isNotNull())
          .groupBy("City", "State")
          .agg(
              count("*").alias("total_accidents"),
              spark_round(avg(col("Severity").cast("double")), 2).alias("avg_severity"),
              spark_round(avg(col("Start_Lat").cast("double")), 4).alias("avg_lat"),
              spark_round(avg(col("Start_Lng").cast("double")), 4).alias("avg_lng"),
              count(
                  col("Severity").cast("int") == 4  # severe only
              ).alias("severe_count")
          )
          .orderBy(desc("total_accidents"))
    )

    result.show(30, truncate=False)

    # Write results as JSON to HDFS
    result.write.mode("overwrite").json("hdfs:///accidents/results/spark/location_stats/")

    print("[DONE] LocationStats job complete.")
    spark.stop()

if __name__ == "__main__":
    main()
