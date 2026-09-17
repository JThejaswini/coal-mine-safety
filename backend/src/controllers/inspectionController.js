const pool = require('../config/db')

const getInspections = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.id,
        i.inspection_date,
        z.name AS zone,
        u.name AS inspector,
        i.helmet_ok,
        i.gloves_ok,
        i.goggles_ok,
        i.equipment_ok,
        i.environment_ok,
        i.status
      FROM inspections i
      JOIN zones z
        ON i.zone_id = z.id
      JOIN users u
        ON i.inspector_id = u.id
      ORDER BY i.inspection_date DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load inspections',
    })
  }
}

const createInspection = async (req, res) => {
  try {
    const {
      zoneId,
      helmetOk,
      glovesOk,
      gogglesOk,
      equipmentOk,
      environmentOk,
    } = req.body

    if (!zoneId) {
      return res.status(400).json({
        message: 'zoneId is required',
      })
    }

    const checks = {
      helmetOk: Boolean(helmetOk),
      glovesOk: Boolean(glovesOk),
      gogglesOk: Boolean(gogglesOk),
      equipmentOk: Boolean(equipmentOk),
      environmentOk: Boolean(environmentOk),
    }

    const allPassed =
      checks.helmetOk &&
      checks.glovesOk &&
      checks.gogglesOk &&
      checks.equipmentOk &&
      checks.environmentOk

    const status = allPassed
      ? 'Passed'
      : 'Failed'

    const inspectionResult = await pool.query(
      `INSERT INTO inspections
       (
         zone_id,
         inspector_id,
         helmet_ok,
         gloves_ok,
         goggles_ok,
         equipment_ok,
         environment_ok,
         status
       )
       VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        zoneId,
        req.user.id,
        checks.helmetOk,
        checks.glovesOk,
        checks.gogglesOk,
        checks.equipmentOk,
        checks.environmentOk,
        status,
      ]
    )

    const inspection =
      inspectionResult.rows[0]

    const failedChecks = []

    if (!checks.helmetOk) {
      failedChecks.push({
        type: 'No Helmet',
        severity: 'High',
      })
    }

    if (!checks.glovesOk) {
      failedChecks.push({
        type: 'No Gloves',
        severity: 'Medium',
      })
    }

    if (!checks.gogglesOk) {
      failedChecks.push({
        type: 'No Goggles',
        severity: 'Medium',
      })
    }

    if (!checks.equipmentOk) {
      failedChecks.push({
        type: 'Unsafe Equipment',
        severity: 'High',
      })
    }

    if (!checks.environmentOk) {
      failedChecks.push({
        type: 'Dust Threshold Exceeded',
        severity: 'Medium',
      })
    }

    const createdViolations = []

    for (const failedCheck of failedChecks) {
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

      const violationResult = await pool.query(
        `INSERT INTO violations
         (
           violation_code,
           type,
           zone_id,
           inspection_id,
           severity,
           status,
           source
         )
         VALUES
         ($1, $2, $3, $4, $5, 'Open', 'Manual Inspection')
         RETURNING *`,
        [
          violationCode,
          failedCheck.type,
          zoneId,
          inspection.id,
          failedCheck.severity,
        ]
      )

      createdViolations.push(
        violationResult.rows[0]
      )
    }

    res.status(201).json({
      message:
        createdViolations.length > 0
          ? 'Inspection completed and violations recorded'
          : 'Inspection completed successfully',
      inspection,
      violations: createdViolations,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create inspection',
    })
  }
}

const getZones = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name
      FROM zones
      ORDER BY name
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to load zones',
    })
  }
}

module.exports = {
  getInspections,
  createInspection,
  getZones,
}