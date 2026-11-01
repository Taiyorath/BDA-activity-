#!/usr/bin/env python3
"""
PySpark Job: Weather Condition Analysis
Groups accident data by Weather_Condition to show impact on accident rates.
Output: JSON to hdfs:///accidents/results/spark/weather_analysis/
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, round as spark_round, desc

def main():
    spark = SparkSession.builder \
        .appName("WeatherAnalysis") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    # Read cleaned processed CSV from HDFS
    df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

    # Group by Weather_Condition
    result = (
        df.filter(col("Weather_Condition").isNotNull())
          .groupBy("Weather_Condition")
          .agg(
              count("*").alias("accident_count"),
              spark_round(avg(col("Severity").cast("double")), 2).alias("avg_severity"),
              spark_round(avg(col("Visibility(mi)").cast("double")), 2).alias("avg_visibility")
          )
          .orderBy(desc("accident_count"))
    )

    result.show(25, truncate=False)

    # Write results as JSON to HDFS
    result.write.mode("overwrite").json("hdfs:///accidents/results/spark/weather_analysis/")

    print("[DONE] WeatherAnalysis job complete.")
    spark.stop()

if __name__ == "__main__":
    main()
