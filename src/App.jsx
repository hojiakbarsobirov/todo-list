import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      
      <Route path='/home' element={<HomePage />} />
    </Routes>
  )
}

export default App