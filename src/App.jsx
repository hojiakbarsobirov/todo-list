import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/RegisterPage'
import DashboardLayout from './components/Layout/DashboardLayout'
import PricesPage from './pages/PricesPage'
import HomePage from './pages/HomePage' // Excel uslubidagi sahifa
import GeneralDashboard from './pages/GeneralDashboard'
import DocumentsPage from './pages/DocumentsPage' // 1. Xujjatlar sahifasini import qilamiz

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

        {/* /home/documents (Xujjatlar sahifasi) */}
        <Route path='documents' element={<DocumentsPage />} /> {/* 2. Yangi marshrut */}
      </Route>
    </Routes>
  )
}

export default App