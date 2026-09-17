import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SafetyMonitoring from './pages/SafetyMonitoring'
import Inspections from './pages/Inspections'
import Violations from './pages/Violations'
import CorrectiveActions from './pages/CorrectiveActions'
import Reinspections from './pages/Reinspections'
import RecurringViolations from './pages/RecurringViolations'
import Compliance from './pages/Compliance'
import Environment from './pages/Environment'
import Workforce from './pages/Workforce'
import Contractors from './pages/Contractors'
import Reports from './pages/Reports'

import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/safety-monitoring"
              element={<SafetyMonitoring />}
            />

            <Route
              path="/inspections"
              element={<Inspections />}
            />

            <Route
              path="/violations"
              element={<Violations />}
            />

            <Route
              path="/corrective-actions"
              element={<CorrectiveActions />}
            />

            <Route
              path="/reinspections"
              element={<Reinspections />}
            />

            <Route
              path="/recurring-violations"
              element={<RecurringViolations />}
            />

            <Route
              path="/compliance"
              element={<Compliance />}
            />

            <Route
              path="/environment"
              element={<Environment />}
            />

            <Route
              path="/workforce"
              element={<Workforce />}
            />

            <Route
              path="/contractors"
              element={<Contractors />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App