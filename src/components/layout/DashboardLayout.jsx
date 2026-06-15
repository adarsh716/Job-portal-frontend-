import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex' }}>
      <Sidebar />
      <main
        style={{ flex: 1, minWidth: 0, marginLeft: 220, transition: 'margin 0.3s ease' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
