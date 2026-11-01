-- ============================================================
-- Pig Latin: Location Statistics
-- Computes accident count and severe accident count per city+state.
-- Stores results to HDFS.
-- ============================================================
-- Usage: pig -f hadoop/pig/location_stats.pig
-- ============================================================

-- Load cleaned processed data
cleaned = LOAD '/accidents/processed/'
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

-- Group by city and state
grouped = GROUP cleaned BY (city, state);

-- Compute total count and severe count (severity >= 4) per location
location_stats = FOREACH grouped GENERATE
    FLATTEN(group)                             AS (city, state),
    COUNT(cleaned)                             AS total_count,
    SUM((int)(cleaned.severity >= 4 ? 1 : 0)) AS severe_count,
    AVG(cleaned.severity)                      AS avg_severity;

-- Order by total count descending
ordered = ORDER location_stats BY total_count DESC;

-- Store results to HDFS
STORE ordered INTO '/accidents/results/pig/location_stats/'
    USING PigStorage(',');
