import { useNavigate } from 'react-router-dom'

function Topbar() {
  const navigate = useNavigate()

  const role =
    localStorage.getItem('userRole') ||
    'User'

  const handleLogout = () => {
    localStorage.removeItem('userRole')

    navigate('/login', {
      replace: true,
    })
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div>
        <p className="text-sm text-slate-500">
          Mine Operations
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">
            {role}
          </p>

          <p className="text-xs text-slate-500">
            Active Session
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Topbar