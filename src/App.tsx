// import React from 'react'
import './App.css'
import SignUpForm from './components/SignUpForm'
import Dashboard from './components/Dashboard'
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <Routes>
        {/* Signup Form at root */}
        <Route path="/" element={<SignUpForm />} />

        {/* Dashboard after login */}
        <Route path="/dashboard" element={<Dashboard  />} />
      </Routes>
    </>
  )
}

export default App
