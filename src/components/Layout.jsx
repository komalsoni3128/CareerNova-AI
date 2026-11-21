import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import HealthBanner from './HealthBanner'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <HealthBanner />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
