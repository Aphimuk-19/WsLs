import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import '@ant-design/v5-patch-for-react-19';
import React from 'react'
import Login from './Page/Login'
import Register from './Page/Register'
import Sidebarlayout from './Layout/Sidebarlayout'
import Product from './Page/Product'
import { Route,Routes } from 'react-router'
import Dashboard from './Page/Dashboard';
import Managelocation from './Page/Managelocation'
import ProductLocation from './Page/ProductLocation';
import ManageUsers from './Page/ManageUsers';
import Account from './Page/Account';




createRoot(document.getElementById('root')).render(
 
  <StrictMode>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={< Login />} />
      <Route path="/Register" element={< Register />} />
      <Route element={<Sidebarlayout />}>
        <Route path="/Product" element={< Product />} />
        <Route path="/Dashboard" element={< Dashboard />} />
        <Route path="/Managelocation" element={< Managelocation/>} />
        <Route path="/ProductLocation" element={< ProductLocation/>} />
        <Route path="/ManageUsers" element={< ManageUsers/>} />
        <Route path="/Account" element={< Account/>} />
      </Route>
      </Routes>
     </BrowserRouter>
  </StrictMode>,
)
