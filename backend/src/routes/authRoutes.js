const express = require('express')

const { login } = require('../controllers/authController')
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', login)

router.get('/me', authenticateToken, (req, res) => {
  res.json({
    message: 'Authenticated user',
    user: req.user,
  })
})

module.exports = router