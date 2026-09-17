import { Navigate, Outlet, useLocation } from 'react-router-dom'

const routeRoles = {
  '/dashboard': [
    'Mine Manager',
    'Safety Officer',
    'Compliance Officer',
    'Senior Management',
  ],

  '/safety-monitoring': [
    'Mine Manager',
    'Safety Officer',
  ],

  '/inspections': [
    'Safety Officer',
    'Compliance Officer',
  ],

  '/violations': [
    'Mine Manager',
    'Safety Officer',
    'Compliance Officer',
  ],

  '/corrective-actions': [
    'Mine Manager',
    'Safety Officer',
  ],

  '/reinspections': [
    'Mine Manager',
    'Safety Officer',
  ],

  '/recurring-violations': [
    'Mine Manager',
    'Safety Officer',
    'Compliance Officer',
    'Senior Management',
  ],

  '/compliance': [
    'Mine Manager',
    'Compliance Officer',
    'Senior Management',
  ],

  '/environment': [
    'Mine Manager',
    'Senior Management',
  ],

  '/workforce': [
    'Mine Manager',
    'Senior Management',
  ],

  '/contractors': [
    'Mine Manager',
    'Senior Management',
  ],

  '/reports': [
    'Mine Manager',
    'Compliance Officer',
    'Senior Management',
  ],
}

function ProtectedRoute() {
  const location = useLocation()

  const role =
    localStorage.getItem('userRole')

  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  const allowedRoles =
    routeRoles[location.pathname]

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute