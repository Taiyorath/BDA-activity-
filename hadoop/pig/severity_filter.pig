-- ============================================================
-- Pig Latin: Severity Filter — Count Severe Accidents by State
-- Filters records where severity >= 3, groups by state,
-- and stores severe accident counts to HDFS.
-- ============================================================
-- Usage: pig -f hadoop/pig/severity_filter.pig
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

-- Filter only moderate-to-severe accidents (severity >= 3)
severe_accidents = FILTER cleaned BY severity >= 3;

-- Group by state
by_state = GROUP severe_accidents BY state;

-- Count severe accidents per state and compute average severity
state_severe_stats = FOREACH by_state GENERATE
    group                      AS state,
    COUNT(severe_accidents)    AS severe_count,
    AVG(severe_accidents.severity) AS avg_severity;

-- Order by severe count descending
ordered = ORDER state_severe_stats BY severe_count DESC;

-- Store results to HDFS
STORE ordered INTO '/accidents/results/pig/severity_by_state/'
    USING PigStorage(',');
