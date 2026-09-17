const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const violationRoutes = require('./routes/violationRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const correctiveActionRoutes = require('./routes/correctiveActionRoutes')
const reinspectionRoutes = require('./routes/reinspectionRoutes')
const inspectionRoutes = require('./routes/inspectionRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Coal Mine Safety API is running',
  })
})

app.use('/api/auth', authRoutes)

app.use(
  '/api/violations',
  violationRoutes
)

app.use(
  '/api/dashboard',
  dashboardRoutes
)

app.use(
  '/api/corrective-actions',
  correctiveActionRoutes
)

app.use(
  '/api/reinspections',
  reinspectionRoutes
)

app.use(
  '/api/inspections',
  inspectionRoutes
)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})