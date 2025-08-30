// import React from 'react'
import './App.css'
import SignUpForm from './SignUpForm'
import Dashboard from './Dashboard'
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <Routes>
        {/* Signup Form at root */}
        <Route path="/" element={<SignUpForm />} />

        {/* Dashboard after login */}
        <Route path="/dashboard" element={<Dashboard user={{ name: "Jonas", email: "jonas@example.com" }} onSignOut={() => alert("Signed out")} />} />
      </Routes>
    </>
  )
}

export default App
