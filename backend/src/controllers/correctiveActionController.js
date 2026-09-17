const pool = require('../config/db')

const getCorrectiveActions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ca.id,
        ca.violation_id,
        ca.action_description,
        ca.deadline,
        ca.status,
        ca.completed_at,
        v.violation_code,
        v.type AS violation,
        v.severity,
        z.name AS zone,
        u.name AS assigned_to
      FROM corrective_actions ca
      JOIN violations v
        ON ca.violation_id = v.id
      JOIN zones z
        ON v.zone_id = z.id
      JOIN users u
        ON ca.assigned_to = u.id
      ORDER BY ca.id DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load corrective actions',
    })
  }
}

const createCorrectiveAction = async (req, res) => {
  try {
    const {
      violationId,
      actionDescription,
      deadline,
    } = req.body

    if (!violationId || !actionDescription) {
      return res.status(400).json({
        message:
          'violationId and actionDescription are required',
      })
    }

    const violationResult = await pool.query(
      `SELECT id, status
       FROM violations
       WHERE id = $1`,
      [violationId]
    )

    if (violationResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Violation not found',
      })
    }

    if (
      violationResult.rows[0].status ===
      'Resolved'
    ) {
      return res.status(400).json({
        message:
          'Cannot create action for a resolved violation',
      })
    }

    const result = await pool.query(
      `INSERT INTO corrective_actions
       (
         violation_id,
         assigned_to,
         action_description,
         deadline,
         status
       )
       VALUES ($1, $2, $3, $4, 'Pending')
       RETURNING *`,
      [
        violationId,
        req.user.id,
        actionDescription,
        deadline || null,
      ]
    )

    res.status(201).json({
      message: 'Corrective action created',
      action: result.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create corrective action',
    })
  }
}

const completeCorrectiveAction = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `UPDATE corrective_actions
       SET
         status = 'Completed',
         completed_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Corrective action not found',
      })
    }

    res.json({
      message: 'Corrective action completed',
      action: result.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to complete corrective action',
    })
  }
}

module.exports = {
  getCorrectiveActions,
  createCorrectiveAction,
  completeCorrectiveAction,
}