import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/RegisterPage'
import DashboardLayout from './components/Layout/DashboardLayout'
import PricesPage from './pages/PricesPage'
import HomePage from './pages/HomePage' // Excel uslubidagi sahifa
import GeneralDashboard from './pages/GeneralDashboard'

function App() {
  return (
    <Routes>
      {/* Tizimga kirish */}
      <Route path='/' element={<LoginPage />} />
      
      {/* Asosiy boshqaruv paneli */}
      <Route path='/home' element={<DashboardLayout />}>
        
        {/* /home (Asosiy Boshqaruv/Statistika sahifasi) */}
        <Route index element={<GeneralDashboard />} />
        
        {/* /home/tasks (Vazifalar va ma'lumotlar jadvali) */}
        <Route path='tasks' element={<HomePage />} />
        
        {/* /home/prices (Zapchast narxlari) */}
        <Route path='prices' element={<PricesPage />} />
      </Route>
    </Routes>
  )
}

export default App