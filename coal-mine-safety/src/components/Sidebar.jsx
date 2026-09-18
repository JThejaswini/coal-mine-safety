import { NavLink } from 'react-router-dom'

const menuGroups = [
  {
    label: 'Overview',
    items: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'grid',
        roles: [
          'Mine Manager',
          'Safety Officer',
          'Compliance Officer',
          'Senior Management',
        ],
      },
    ],
  },
  {
    label: 'Safety Operations',
    items: [
      {
        name: 'Safety Monitoring',
        path: '/safety-monitoring',
        icon: 'monitor',
        roles: ['Mine Manager', 'Safety Officer'],
      },
      {
        name: 'Inspections',
        path: '/inspections',
        icon: 'clipboard',
        roles: ['Safety Officer', 'Compliance Officer'],
      },
      {
        name: 'Violations',
        path: '/violations',
        icon: 'alert',
        roles: [
          'Mine Manager',
          'Safety Officer',
          'Compliance Officer',
        ],
      },
      {
        name: 'Corrective Actions',
        path: '/corrective-actions',
        icon: 'check',
        roles: [
          'Mine Manager',
          'Safety Officer',
          'Area Supervisor',
        ],
      },
      {
        name: 'Re-inspections',
        path: '/reinspections',
        icon: 'refresh',
        roles: ['Mine Manager', 'Safety Officer'],
      },
      {
        name: 'Recurring Violations',
        path: '/recurring-violations',
        icon: 'repeat',
        roles: [
          'Mine Manager',
          'Safety Officer',
          'Compliance Officer',
          'Senior Management',
        ],
      },
    ],
  },
  {
    label: 'Governance',
    items: [
      {
        name: 'Compliance',
        path: '/compliance',
        icon: 'shield',
        roles: [
          'Mine Manager',
          'Compliance Officer',
          'Senior Management',
        ],
      },
      {
        name: 'Environment',
        path: '/environment',
        icon: 'leaf',
        roles: ['Mine Manager', 'Senior Management'],
      },
      {
        name: 'Workforce',
        path: '/workforce',
        icon: 'users',
        roles: ['Mine Manager', 'Senior Management'],
      },
      {
        name: 'Contractors',
        path: '/contractors',
        icon: 'building',
        roles: ['Mine Manager', 'Senior Management'],
      },
      {
        name: 'Reports',
        path: '/reports',
        icon: 'report',
        roles: [
          'Mine Manager',
          'Compliance Officer',
          'Senior Management',
        ],
      },
    ],
  },
]

function Icon({ type }) {
  const common = 'h-[17px] w-[17px] stroke-[1.8]'

  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </>
    ),

    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5V3h6v1.5" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
        <path d="M9 18h4" />
      </>
    ),

    alert: (
      <>
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v5" />
        <path d="M12 17.5h.01" />
      </>
    ),

    check: (
      <>
        <path d="M20 7 10 17l-5-5" />
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" />
        <path d="M20 20v-4h-4" />
      </>
    ),

    repeat: (
      <>
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11V9a3 3 0 0 1 3-3h15" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v2a3 3 0 0 1-3 3H3" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),

    leaf: (
      <>
        <path d="M20 4C11 4 5 8 5 14c0 3.3 2.7 6 6 6 6 0 9-6 9-16Z" />
        <path d="M4 20c3-5 6-8 12-11" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    building: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" />
        <path d="M17 9h3a1 1 0 0 1 1 1v11" />
        <path d="M8 7h2" />
        <path d="M12 7h2" />
        <path d="M8 11h2" />
        <path d="M12 11h2" />
        <path d="M8 15h2" />
        <path d="M12 15h2" />
        <path d="M9 21v-3h4v3" />
      </>
    ),

    report: (
      <>
        <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
        <path d="M8 9h2" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={common}
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  )
}

function Sidebar() {
  const role =
    localStorage.getItem('userRole') ||
    'Mine Manager'

  const initials = role
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r border-[#303a34] bg-[#202823] text-white lg:flex">
      {/* Brand */}
      <div className="border-b border-white/[0.08] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[#d6a84f] text-[#202823]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                d="M4 19h16M6 19V9l6-5 6 5v10M9 19v-5h6v5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="absolute -bottom-1 -right-1 h-2 w-2 border border-[#202823] bg-[#3b9a67]" />
          </div>

          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-tight text-white">
              CoalMine
            </p>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.17em] text-white/40">
              Safety Command
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        {menuGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(role)
          )

          if (visibleItems.length === 0) {
            return null
          }

          return (
            <div
              key={group.label}
              className="mb-6 last:mb-0"
            >
              <p className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                {group.label}
              </p>

              <div className="space-y-0.5">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 border-l-2 px-3 py-2.5 text-[13px] transition ${isActive
                        ? 'border-[#d6a84f] bg-white/[0.075] text-white'
                        : 'border-transparent text-white/52 hover:bg-white/[0.045] hover:text-white/90'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={
                            isActive
                              ? 'text-[#d6a84f]'
                              : 'text-white/32 transition group-hover:text-white/60'
                          }
                        >
                          <Icon type={item.icon} />
                        </span>

                        <span className="min-w-0 flex-1 truncate">
                          {item.name}
                        </span>

                        {isActive && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a84f]" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User / system area */}
      <div className="border-t border-white/[0.08] p-4">
        <div className="border border-white/[0.07] bg-white/[0.035] px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#334039] text-[10px] font-semibold text-[#d6a84f]">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/90">
                {role}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] text-white/40">
                  System connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar