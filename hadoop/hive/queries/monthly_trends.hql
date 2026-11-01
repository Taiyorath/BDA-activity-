-- ============================================================
-- Hive Query: Monthly Accident Trends (Year + Month)
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/monthly_trends.hql
-- ============================================================

USE road_safety_db;

SELECT
    year,
    month,
    COUNT(*) AS total_accidents,
    ROUND(AVG(severity), 2) AS avg_severity
FROM road_safety_db.accidents
WHERE year IS NOT NULL
  AND month IS NOT NULL
GROUP BY year, month
ORDER BY year, month;
