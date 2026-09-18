import { useLocation, useNavigate } from 'react-router-dom'

const pageNames = {
  '/dashboard': {
    section: 'Overview',
    title: 'Safety Dashboard',
  },
  '/safety-monitoring': {
    section: 'Safety Operations',
    title: 'Safety Monitoring',
  },
  '/inspections': {
    section: 'Safety Operations',
    title: 'Inspections',
  },
  '/violations': {
    section: 'Safety Operations',
    title: 'Violations',
  },
  '/corrective-actions': {
    section: 'Safety Operations',
    title: 'Corrective Actions',
  },
  '/reinspections': {
    section: 'Safety Operations',
    title: 'Re-inspections',
  },
  '/recurring-violations': {
    section: 'Safety Operations',
    title: 'Recurring Violations',
  },
  '/compliance': {
    section: 'Governance',
    title: 'Compliance',
  },
  '/environment': {
    section: 'Governance',
    title: 'Environment',
  },
  '/workforce': {
    section: 'Governance',
    title: 'Workforce',
  },
  '/contractors': {
    section: 'Governance',
    title: 'Contractors',
  },
  '/reports': {
    section: 'Governance',
    title: 'Reports',
  },
}

function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const role =
    localStorage.getItem('userRole') ||
    'User'

  const currentPage =
    pageNames[location.pathname] || {
      section: 'Mine Operations',
      title: 'Safety & Compliance',
    }

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('token')

    navigate('/login', {
      replace: true,
    })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#dfe3de] bg-[#f8f9f6]/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-6 px-5 sm:px-7 lg:px-9">
        {/* Page identity */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.13em] text-[#7a837d]">
            <span>{currentPage.section}</span>
            <span className="text-[#b7bdb8]">/</span>
            <span className="text-[#9b6f21]">Control Center</span>
          </div>

          <h1 className="mt-1 truncate text-[20px] font-semibold tracking-[-0.02em] text-[#202823]">
            {currentPage.title}
          </h1>
        </div>

        {/* Right controls */}
        <div className="flex shrink-0 items-center gap-3">
          {/* System status */}
          <div className="hidden items-center gap-2 rounded-md border border-[#dfe3de] bg-white px-3 py-2 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-[11px] font-medium text-[#59635d]">
              Monitoring active
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-[#dfe3de] pl-4">
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold text-[#303a34]">
                {role}
              </p>

              <p className="mt-0.5 text-[10px] text-[#8a938d]">
                Authorized session
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#334039] text-xs font-semibold text-[#d6a84f]">
              {role
                .split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-[#d7dcd8] bg-white px-3 py-2 text-xs font-medium text-[#59635d] transition hover:border-[#bfc6c1] hover:bg-[#f3f5f2] hover:text-[#202823]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar