-- ============================================================
-- Pig Latin: Clean Accidents
-- Loads raw accident data from HDFS, filters nulls and invalid
-- coordinates, and stores cleaned output to HDFS.
-- ============================================================
-- Usage: pig -f hadoop/pig/clean_accidents.pig
-- ============================================================

-- Load raw CSV with schema
raw_data = LOAD '/accidents/raw/synthetic_accidents.csv'
    USING PigStorage(',')
    AS (
        id:chararray,
        source:chararray,
        severity:int,
        start_time:chararray,
        end_time:chararray,
        start_lat:double,
        start_lng:double,
        distance_mi:double,
        description:chararray,
        street:chararray,
        city:chararray,
        county:chararray,
        state:chararray,
        zipcode:chararray,
        country:chararray,
        timezone:chararray,
        airport_code:chararray,
        weather_timestamp:chararray,
        temperature_f:double,
        wind_chill_f:double,
        humidity_pct:double,
        pressure_in:double,
        visibility_mi:double,
        wind_direction:chararray,
        wind_speed_mph:double,
        precipitation_in:double,
        weather_condition:chararray,
        amenity:chararray,
        bump:chararray,
        crossing:chararray,
        give_way:chararray,
        junction:chararray,
        no_exit:chararray,
        railway:chararray,
        roundabout:chararray,
        station:chararray,
        stop_field:chararray,
        traffic_calming:chararray,
        traffic_signal:chararray,
        turning_loop:chararray,
        sunrise_sunset:chararray,
        civil_twilight:chararray,
        nautical_twilight:chararray,
        astronomical_twilight:chararray,
        road_condition:chararray
    );

-- Skip header row (ID is the first field of the header)
no_header = FILTER raw_data BY id != 'ID';

-- Filter out rows with null critical fields
not_null = FILTER no_header BY
    city      IS NOT NULL AND city      != '' AND
    state     IS NOT NULL AND state     != '' AND
    start_lat IS NOT NULL AND
    start_lng IS NOT NULL;

-- Filter rows with invalid coordinate ranges
valid_coords = FILTER not_null BY
    start_lat >= -90.0  AND start_lat <= 90.0 AND
    start_lng >= -180.0 AND start_lng <= 180.0;

-- Store cleaned data to HDFS processed directory
STORE valid_coords INTO '/accidents/processed/'
    USING PigStorage(',');
