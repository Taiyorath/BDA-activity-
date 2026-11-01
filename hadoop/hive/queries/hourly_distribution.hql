-- ============================================================
-- Hive Query: Hourly Accident Distribution
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/hourly_distribution.hql
-- ============================================================

USE road_safety_db;

SELECT
    hour,
    COUNT(*) AS count
FROM road_safety_db.accidents
GROUP BY hour
ORDER BY hour;
