-- ============================================================
-- Hive Query: Accidents by Weather Condition (Top 15)
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/weather_analysis.hql
-- ============================================================

USE road_safety_db;

SELECT
    weather_condition,
    COUNT(*) AS total,
    ROUND(AVG(severity), 2) AS avg_severity
FROM road_safety_db.accidents
WHERE weather_condition IS NOT NULL
  AND weather_condition != ''
GROUP BY weather_condition
ORDER BY total DESC
LIMIT 15;
