const express = require('express')

const {
  getViolations,
  createViolation,
  updateViolationStatus,
} = require('../controllers/violationController')

const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', getViolations)

router.post('/', createViolation)

router.patch('/:id/status', updateViolationStatus)

module.exports = router