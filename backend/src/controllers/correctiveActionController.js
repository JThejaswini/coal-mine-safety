const pool = require('../config/db')

const getCorrectiveActions = async (req, res) => {
  try {
    let query = `
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
        u.name AS assigned_to,
        u.id AS assigned_to_id
      FROM corrective_actions ca
      JOIN violations v
        ON ca.violation_id = v.id
      JOIN zones z
        ON v.zone_id = z.id
      JOIN users u
        ON ca.assigned_to = u.id
    `

    const params = []

    if (req.user.role === 'Area Supervisor') {
      query += ` WHERE ca.assigned_to = $1`
      params.push(req.user.id)
    } else if (
      !['Mine Manager', 'Safety Officer'].includes(req.user.role)
    ) {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    query += ` ORDER BY ca.id DESC`

    const result = await pool.query(query, params)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load corrective actions',
    })
  }
}

const getEligibleSupervisors = async (req, res) => {
  try {
    const { violationId } = req.query

    if (!violationId) {
      return res.status(400).json({
        message: 'violationId is required',
      })
    }

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.zone_id,
        z.name AS zone
      FROM users u
      JOIN zones z
        ON u.zone_id = z.id
      JOIN violations v
        ON v.zone_id = u.zone_id
      WHERE
        v.id = $1
        AND u.role = 'Area Supervisor'
        AND u.is_active = true
      ORDER BY u.name
      `,
      [violationId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load eligible supervisors',
    })
  }
}

const createCorrectiveAction = async (req, res) => {
  try {
    const {
      violationId,
      assignedTo,
      actionDescription,
      deadline,
    } = req.body

    if (!violationId || !assignedTo || !actionDescription) {
      return res.status(400).json({
        message:
          'violationId, assignedTo and actionDescription are required',
      })
    }

    if (
      !['Safety Officer', 'Mine Manager'].includes(req.user.role)
    ) {
      return res.status(403).json({
        message: 'Only Safety Officer or Mine Manager can create actions',
      })
    }

    const violationResult = await pool.query(
      `
      SELECT id, status, zone_id
      FROM violations
      WHERE id = $1
      `,
      [violationId]
    )

    if (violationResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Violation not found',
      })
    }

    const violation = violationResult.rows[0]

    if (violation.status === 'Resolved') {
      return res.status(400).json({
        message:
          'Cannot create action for a resolved violation',
      })
    }

    const supervisorResult = await pool.query(
      `
      SELECT id, name, role, zone_id, is_active
      FROM users
      WHERE id = $1
      `,
      [assignedTo]
    )

    if (supervisorResult.rows.length === 0) {
      return res.status(400).json({
        message: 'Selected supervisor not found',
      })
    }

    const supervisor = supervisorResult.rows[0]

    if (supervisor.role !== 'Area Supervisor') {
      return res.status(400).json({
        message: 'Selected user is not an Area Supervisor',
      })
    }

    if (!supervisor.is_active) {
      return res.status(400).json({
        message: 'Selected supervisor is inactive',
      })
    }

    if (supervisor.zone_id !== violation.zone_id) {
      return res.status(400).json({
        message:
          'Selected supervisor is not assigned to the violation zone',
      })
    }

    const result = await pool.query(
      `
      INSERT INTO corrective_actions
      (
        violation_id,
        assigned_to,
        action_description,
        deadline,
        status
      )
      VALUES ($1, $2, $3, $4, 'Pending')
      RETURNING *
      `,
      [
        violationId,
        assignedTo,
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

    if (req.user.role !== 'Area Supervisor') {
      return res.status(403).json({
        message: 'Only Area Supervisor can complete corrective actions',
      })
    }

    const result = await pool.query(
      `
      UPDATE corrective_actions
      SET
        status = 'Completed',
        completed_at = CURRENT_TIMESTAMP
      WHERE
        id = $1
        AND assigned_to = $2
        AND status != 'Completed'
      RETURNING *
      `,
      [id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          'Corrective action not found or not assigned to you',
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
  getEligibleSupervisors,
  createCorrectiveAction,
  completeCorrectiveAction,
}