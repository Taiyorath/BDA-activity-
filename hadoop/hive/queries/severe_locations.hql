-- ============================================================
-- Hive Query: Severe Accident Locations (Severity = 4)
-- ============================================================
-- Identifies cities with the most severe accidents (black spots)
-- Usage: hive -f hadoop/hive/queries/severe_locations.hql
-- ============================================================

USE road_safety_db;

SELECT
    city,
    state,
    COUNT(*) AS severe_accident_count,
    ROUND(AVG(start_lat), 4) AS avg_lat,
    ROUND(AVG(start_lng), 4) AS avg_lng
FROM road_safety_db.accidents
WHERE severity = 4
  AND city IS NOT NULL
  AND state IS NOT NULL
GROUP BY city, state
ORDER BY severe_accident_count DESC
LIMIT 25;
