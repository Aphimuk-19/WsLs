import React from 'react'
import Login from './Page/Login'
import Register from './Page/Register'
import Sidebar from './Template/Sidebar'
import Sidebarlayout from './Layout/Sidebarlayout'
import Product from './Page/Product'
import { Route,Routes } from 'react-router'
import Dashboard from './Page/Dashboard'
import Managelocation from './Page/Managelocation'

const App = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={< Login />} />
      <Route path="/Register" element={< Register />} />
      <Route element={<Sidebarlayout />}>
        <Route path="/Product" element={< Product />} />
        <Route path="/Dashboard" element={< Dashboard />} />
        <Route path="/Managelocation" element={< Managelocation />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
