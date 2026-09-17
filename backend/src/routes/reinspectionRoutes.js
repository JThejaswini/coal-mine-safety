const express = require('express')

const {
  getReinspections,
  createReinspection,
} = require('../controllers/reinspectionController')

const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', getReinspections)

router.post('/', createReinspection)

module.exports = router