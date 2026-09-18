const express = require('express')

const {
  getCorrectiveActions,
  getEligibleSupervisors,
  createCorrectiveAction,
  completeCorrectiveAction,
} = require('../controllers/correctiveActionController')

const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', getCorrectiveActions)

router.get('/supervisors', getEligibleSupervisors)

router.post('/', createCorrectiveAction)

router.patch('/:id/complete', completeCorrectiveAction)

module.exports = router