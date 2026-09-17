const express = require('express')

const {
  getDashboard,
} = require('../controllers/dashboardController')

const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authenticateToken)

router.get('/', getDashboard)

module.exports = router