import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../config/config'; // Add this import

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  const token = getTokenFromUrl();

  useEffect(() => {
    if (!token) {
      setTokenError("ไม่พบโทเค็นรีเซ็ตรหัสผ่าน กรุณาขอรีเซ็ตรหัสผ่านใหม่");
    }
    setPasswordMismatch(
      formData.password !== formData.confirmPassword && formData.confirmPassword !== ""
    );
  }, [formData.password, formData.confirmPassword, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ["รหัสผ่านไม่ตรงกัน"];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      setTokenError("โทเค็นไม่ถูกต้องหรือหมดอายุ");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/reset-password`, // Updated to use BASE_URL
        {
          token,
          password: formData.password,
        }
      );

      console.log("Reset Password Response:", response.data);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({
        server:
          error.response?.data?.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน",
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.password === formData.confirmPassword &&
      formData.password !== "" &&
      token
    );
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-red-600">เกิดข้อผิดพลาด</h2>
          <p className="mt-2 text-sm text-gray-600">{tokenError}</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-4 text-blue-600 hover:underline"
          >
            ขอรีเซ็ตรหัสผ่านใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          {!isSuccess ? (
            <>
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
                ตั้งรหัสผ่านใหม่
              </h2>
              <p className="text-center text-sm text-gray-600 mb-8">
                กรุณาตั้งรหัสผ่านใหม่ของคุณ
              </p>

              {errors.server && (
                <div className="mb-6 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200">
                  {errors.server}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    รหัสผ่านใหม่
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <div className="mt-2 text-sm text-red-600">
                      {errors.password.join(", ")}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordMismatch ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  {passwordMismatch && (
                    <div className="mt-2 text-sm text-red-600">รหัสผ่านไม่ตรงกัน</div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-md font-medium transition duration-150 ${
                    isFormValid() && !isSubmitting
                      ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      : "bg-blue-600 text-white opacity-70 cursor-not-allowed"
                  }`}
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-3 text-xl font-bold text-gray-800">
                เปลี่ยนรหัสผ่านสำเร็จ
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                รหัสผ่านของคุณได้รับการเปลี่ยนเรียบร้อยแล้ว
                <br />
                กำลังนำคุณไปที่หน้าเข้าสู่ระบบ...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;