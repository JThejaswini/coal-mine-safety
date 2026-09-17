const pool = require('../config/db')

const getReinspections = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.corrective_action_id,
        r.inspector_id,
        r.inspection_date,
        r.result,
        r.remarks,
        ca.violation_id,
        v.violation_code,
        v.type AS violation,
        z.name AS zone,
        u.name AS inspector
      FROM reinspections r
      JOIN corrective_actions ca
        ON r.corrective_action_id = ca.id
      JOIN violations v
        ON ca.violation_id = v.id
      JOIN zones z
        ON v.zone_id = z.id
      JOIN users u
        ON r.inspector_id = u.id
      ORDER BY r.id DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load re-inspections',
    })
  }
}

const createReinspection = async (req, res) => {
  try {
    const {
      correctiveActionId,
      result,
      remarks,
    } = req.body

    if (!correctiveActionId || !result) {
      return res.status(400).json({
        message:
          'correctiveActionId and result are required',
      })
    }

    if (
      !['Passed', 'Failed'].includes(result)
    ) {
      return res.status(400).json({
        message: 'Invalid re-inspection result',
      })
    }

    const actionResult = await pool.query(
      `SELECT violation_id
       FROM corrective_actions
       WHERE id = $1`,
      [correctiveActionId]
    )

    if (actionResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Corrective action not found',
      })
    }

    const violationId =
      actionResult.rows[0].violation_id

    const resultData = await pool.query(
      `INSERT INTO reinspections
       (
         corrective_action_id,
         inspector_id,
         result,
         remarks
       )
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        correctiveActionId,
        req.user.id,
        result,
        remarks || null,
      ]
    )

    if (result === 'Passed') {
      await pool.query(
        `UPDATE violations
         SET status = 'Resolved'
         WHERE id = $1`,
        [violationId]
      )
    }

    res.status(201).json({
      message:
        result === 'Passed'
          ? 'Re-inspection passed and violation resolved'
          : 'Re-inspection failed',
      reinspection: resultData.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create re-inspection',
    })
  }
}

module.exports = {
  getReinspections,
  createReinspection,
}