-- ============================================================
-- Hive Query: Accidents by State (Top 15)
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/accidents_by_state.hql
-- ============================================================

USE road_safety_db;

SELECT
    state,
    COUNT(*) AS total
FROM road_safety_db.accidents
GROUP BY state
ORDER BY total DESC
LIMIT 15;
