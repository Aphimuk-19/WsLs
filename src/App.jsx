import React from "react";
import { BrowserRouter as Route, Routes } from "react-router-dom";
import PasswordResetLink from "./Page/PasswordResetLink";
import ResetPasswordForm from "./Page/ResetPasswordForm";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/PasswordResetLink" element={<PasswordResetLink />} />
          <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
