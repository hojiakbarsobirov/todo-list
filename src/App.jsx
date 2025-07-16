import './App.css'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<RegisterPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </>
  )
}

export default App
