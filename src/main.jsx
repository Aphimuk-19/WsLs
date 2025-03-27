import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import Login from "./Page/Login";
import Register from "./Page/Register";
import Sidebarlayout from "./Layout/Sidebarlayout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import Managelocation from "./Page/Managelocation";
import ProductLocation from "./Page/ProductLocation";
import ManageUsers from "./Page/ManageUsers";
import Account from "./Page/Account";
import { LocationProvider } from "./Context/LocationContext";
import PasswordResetLink from "./Page/PasswordResetLink";
import ResetPasswordForm from "./Page/ResetPasswordForm";
import EditProfilePage from "./Page/EditProfilePage";
import Addproduct from "./Page/Addproduct";
import Requisition from "./Page/Requisition";
import Exportpage from "./Page/Exportpage";
import ProductTransfer from "./Page/Producttranfer";
import TranferProduct from "./Page/TranferProduct";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LocationProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/PasswordResetLink" element={<PasswordResetLink />} />
          <Route path="/reset-password/*" element={<ResetPasswordForm />} />
          <Route path="/EditProfilePage" element={<EditProfilePage />} />
          <Route path="/Addproduct" element={<Addproduct />} />
          <Route path="/Exportpage" element={<Exportpage />} />
          <Route path="/TranferProduct" element={<TranferProduct />} />
          <Route element={<Sidebarlayout />}>
            <Route path="/Requisition" element={<Requisition />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Managelocation" element={<Managelocation />} />
            <Route path="/ProductLocation" element={<ProductLocation />} />
            <Route path="/ManageUsers" element={<ManageUsers />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/ProductTransfer" element={<ProductTransfer />} />
          </Route>
        </Routes>
      </LocationProvider>
    </BrowserRouter>
  </StrictMode>
);