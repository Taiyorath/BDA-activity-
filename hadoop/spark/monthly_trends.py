#!/usr/bin/env python3
"""
PySpark Job: Monthly Accident Trends
Groups accident data by Year and Month to show trend over time.
Output: JSON to hdfs:///accidents/results/spark/monthly_trends/
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, round as spark_round

def main():
    spark = SparkSession.builder \
        .appName("MonthlyTrends") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")

    # Read cleaned processed CSV from HDFS
    df = spark.read.option("header", True).csv("hdfs:///accidents/processed/")

    # Cast Year and Month to integer for correct ordering
    df = df.withColumn("Year",  col("Year").cast("int")) \
           .withColumn("Month", col("Month").cast("int"))

    # Group by Year and Month
    result = (
        df.groupBy("Year", "Month")
          .agg(
              count("*").alias("accident_count"),
              spark_round(avg(col("Severity").cast("double")), 2).alias("avg_severity")
          )
          .orderBy("Year", "Month")
    )

    result.show(100, truncate=False)

    # Write results as JSON to HDFS
    result.write.mode("overwrite").json("hdfs:///accidents/results/spark/monthly_trends/")

    print("[DONE] MonthlyTrends job complete.")
    spark.stop()

if __name__ == "__main__":
    main()
