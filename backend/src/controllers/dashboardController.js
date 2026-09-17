const pool = require('../config/db')

const getDashboard = async (req, res) => {
  try {
    const inspectionsResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM inspections'
    )

    const openViolationsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM violations
       WHERE status = 'Open'`
    )

    const highRiskResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM violations
       WHERE severity = 'High'
       AND status != 'Resolved'`
    )

    const pendingActionsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM corrective_actions
       WHERE status = 'Pending'`
    )

    const resolvedResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM violations
       WHERE status = 'Resolved'`
    )

    const totalViolationsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM violations`
    )

    const violationsByZoneResult = await pool.query(
      `SELECT
         z.name AS zone,
         COUNT(v.id)::int AS count
       FROM zones z
       LEFT JOIN violations v
         ON v.zone_id = z.id
       GROUP BY z.id, z.name
       ORDER BY count DESC`
    )

    const totalViolations =
      totalViolationsResult.rows[0].count

    const resolvedViolations =
      resolvedResult.rows[0].count

    const compliance =
      totalViolations === 0
        ? 100
        : Math.round(
            (resolvedViolations /
              totalViolations) *
              100
          )

    res.json({
      inspections:
        inspectionsResult.rows[0].count,

      openViolations:
        openViolationsResult.rows[0].count,

      highRiskIssues:
        highRiskResult.rows[0].count,

      pendingActions:
        pendingActionsResult.rows[0].count,

      resolvedViolations,

      compliance,

      violationsByZone:
        violationsByZoneResult.rows,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load dashboard',
    })
  }
}

module.exports = {
  getDashboard,
}