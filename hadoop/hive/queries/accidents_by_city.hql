-- ============================================================
-- Hive Query: Accidents by City (Top 20)
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/accidents_by_city.hql
-- ============================================================

USE road_safety_db;

SELECT
    city,
    state,
    COUNT(*) AS total
FROM road_safety_db.accidents
GROUP BY city, state
ORDER BY total DESC
LIMIT 20;
