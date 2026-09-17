const pool = require('../config/db')

const getViolations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         v.id,
         v.violation_code,
         v.type,
         v.severity,
         v.status,
         v.source,
         v.detected_at,
         z.name AS zone
       FROM violations v
       JOIN zones z ON v.zone_id = z.id
       ORDER BY v.detected_at DESC`
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load violations',
    })
  }
}

const createViolation = async (req, res) => {
  try {
    const {
      type,
      zoneId,
      severity,
      source,
    } = req.body

    if (!type || !zoneId || !severity || !source) {
      return res.status(400).json({
        message: 'type, zoneId, severity and source are required',
      })
    }

    const codeResult = await pool.query(
      `SELECT 'V-' || LPAD(
        (COALESCE(MAX(id), 0) + 1)::text,
        4,
        '0'
      ) AS code
      FROM violations`
    )

    const violationCode =
      codeResult.rows[0].code

    const result = await pool.query(
      `INSERT INTO violations
       (violation_code, type, zone_id, severity, status, source)
       VALUES ($1, $2, $3, $4, 'Open', $5)
       RETURNING *`,
      [
        violationCode,
        type,
        zoneId,
        severity,
        source,
      ]
    )

    res.status(201).json({
      message: 'Violation created',
      violation: result.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create violation',
    })
  }
}

const updateViolationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = [
      'Open',
      'Under Review',
      'Resolved',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
      })
    }

    const result = await pool.query(
      `UPDATE violations
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Violation not found',
      })
    }

    res.json({
      message: 'Violation updated',
      violation: result.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update violation',
    })
  }
}

module.exports = {
  getViolations,
  createViolation,
  updateViolationStatus,
}