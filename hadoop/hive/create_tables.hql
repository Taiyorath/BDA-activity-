-- ============================================================
-- Hive DDL: Create road_safety_db and accidents external table
-- ============================================================
-- Usage: hive -f hadoop/hive/create_tables.hql
-- ============================================================

CREATE DATABASE IF NOT EXISTS road_safety_db;
USE road_safety_db;

CREATE EXTERNAL TABLE IF NOT EXISTS accidents (
  id               STRING,
  source           STRING,
  severity         INT,
  start_time       STRING,
  end_time         STRING,
  start_lat        DOUBLE,
  start_lng        DOUBLE,
  distance_mi      DOUBLE,
  description      STRING,
  street           STRING,
  city             STRING,
  county           STRING,
  state            STRING,
  zipcode          STRING,
  country          STRING,
  temperature_f    DOUBLE,
  humidity_pct     DOUBLE,
  visibility_mi    DOUBLE,
  wind_speed_mph   DOUBLE,
  weather_condition STRING,
  road_condition   STRING,
  sunrise_sunset   STRING,
  severity_label   STRING,
  hour             INT,
  month            INT,
  year             INT,
  day_of_week      STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/accidents/processed/'
TBLPROPERTIES ("skip.header.line.count"="1");
