import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function AppLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout