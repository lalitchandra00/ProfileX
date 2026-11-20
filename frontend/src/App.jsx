import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AssistantPanel from './components/AssistantPanel'
import { ProfileFormProvider } from './context/ProfileFormProvider'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <ProfileFormProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <AssistantPanel />
      </ProfileFormProvider>
    </BrowserRouter>
  )
}

export default App
