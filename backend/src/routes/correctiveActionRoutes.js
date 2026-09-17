const express = require('express')

const {
  getCorrectiveActions,
  createCorrectiveAction,
  completeCorrectiveAction,
} = require('../controllers/correctiveActionController')

const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', getCorrectiveActions)

router.post('/', createCorrectiveAction)

router.patch('/:id/complete', completeCorrectiveAction)

module.exports = router