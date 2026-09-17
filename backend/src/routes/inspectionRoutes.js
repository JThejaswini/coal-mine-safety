const express = require('express')

const {
  getInspections,
  createInspection,
  getZones,
} = require('../controllers/inspectionController')

const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', getInspections)

router.get('/zones', getZones)

router.post('/', createInspection)

module.exports = router