-- ============================================================
-- Hive Query: Severity Label Distribution
-- ============================================================
-- Usage: hive -f hadoop/hive/queries/severity_distribution.hql
-- ============================================================

USE road_safety_db;

SELECT
    severity_label,
    COUNT(*) AS total,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM road_safety_db.accidents
GROUP BY severity_label
ORDER BY total DESC;
