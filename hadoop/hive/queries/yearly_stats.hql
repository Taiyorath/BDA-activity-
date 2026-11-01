-- ============================================================
-- Hive Query: Yearly Statistics
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/yearly_stats.hql
-- ============================================================

USE road_safety_db;

SELECT
    year,
    COUNT(*) AS total_accidents,
    ROUND(AVG(severity), 2) AS avg_severity,
    SUM(CASE WHEN severity = 4 THEN 1 ELSE 0 END) AS severe_count,
    SUM(CASE WHEN severity = 1 THEN 1 ELSE 0 END) AS minor_count
FROM road_safety_db.accidents
WHERE year IS NOT NULL
GROUP BY year
ORDER BY year;
