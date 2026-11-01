#!/usr/bin/env python3
"""
PySpark Job: Accident Frequency by City and State
Reads cleaned accidents from HDFS and writes city-level frequency counts.
Output: JSON to hdfs:///accidents/results/spark/city_freq/
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, desc

def main():
    spark = SparkSession.builder \
        .appName("AccidentFrequency") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    # Read cleaned processed CSV from HDFS
    df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

    # Group by City and State, count accidents, order descending
    result = (
        df.groupBy("City", "State")
          .agg(count("*").alias("accident_count"))
          .orderBy(desc("accident_count"))
    )

    result.show(20, truncate=False)

    # Write results as JSON to HDFS
    result.write.mode("overwrite").json("hdfs:///accidents/results/spark/city_freq/")

    print("[DONE] AccidentFrequency job complete.")
    spark.stop()

if __name__ == "__main__":
    main()
