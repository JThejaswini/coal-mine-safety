import { NavLink } from 'react-router-dom'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    roles: [
      'Mine Manager',
      'Safety Officer',
      'Compliance Officer',
      'Senior Management',
    ],
  },
  {
    name: 'Safety Monitoring',
    path: '/safety-monitoring',
    roles: [
      'Mine Manager',
      'Safety Officer',
    ],
  },
  {
    name: 'Inspections',
    path: '/inspections',
    roles: [
      'Safety Officer',
      'Compliance Officer',
    ],
  },
  {
    name: 'Violations',
    path: '/violations',
    roles: [
      'Mine Manager',
      'Safety Officer',
      'Compliance Officer',
    ],
  },
  {
    name: 'Corrective Actions',
    path: '/corrective-actions',
    roles: [
      'Mine Manager',
      'Safety Officer',
    ],
  },
  {
    name: 'Re-inspections',
    path: '/reinspections',
    roles: [
      'Mine Manager',
      'Safety Officer',
    ],
  },
  {
    name: 'Recurring Violations',
    path: '/recurring-violations',
    roles: [
      'Mine Manager',
      'Safety Officer',
      'Compliance Officer',
      'Senior Management',
    ],
  },
  {
    name: 'Compliance',
    path: '/compliance',
    roles: [
      'Mine Manager',
      'Compliance Officer',
      'Senior Management',
    ],
  },
  {
    name: 'Environment',
    path: '/environment',
    roles: [
      'Mine Manager',
      'Senior Management',
    ],
  },
  {
    name: 'Workforce',
    path: '/workforce',
    roles: [
      'Mine Manager',
      'Senior Management',
    ],
  },
  {
    name: 'Contractors',
    path: '/contractors',
    roles: [
      'Mine Manager',
      'Senior Management',
    ],
  },
  {
    name: 'Reports',
    path: '/reports',
    roles: [
      'Mine Manager',
      'Compliance Officer',
      'Senior Management',
    ],
  },
]

function Sidebar() {
  const role =
    localStorage.getItem('userRole') ||
    'Mine Manager'

  const visibleItems =
    menuItems.filter((item) =>
      item.roles.includes(role)
    )

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-6 py-6">
        <h1 className="text-lg font-bold">
          CoalMine Safety
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Safety & Compliance
        </p>
      </div>

      <div className="border-b border-slate-700 px-6 py-4">
        <p className="text-xs text-slate-400">
          Logged in as
        </p>

        <p className="mt-1 text-sm font-medium text-white">
          {role}
        </p>
      </div>

      <nav className="space-y-1 p-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar