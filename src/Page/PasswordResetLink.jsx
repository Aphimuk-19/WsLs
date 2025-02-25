import React, { useState } from "react";
import { Link } from "react-router-dom";

const PasswordResetLink = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("กรุณากรอกอีเมลของคุณ");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // จำลองการส่งคำขอไปยังเซิร์ฟเวอร์
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          {/* โลโก้ */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {isSuccess ? (
            // หน้าสำเร็จ
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
                ส่งลิงก์รีเซ็ตรหัสผ่านเรียบร้อยแล้ว
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยัง {email} แล้ว
                กรุณาตรวจสอบอีเมลของคุณและคลิกที่ลิงก์เพื่อดำเนินการต่อ
              </p>
              <p className="mt-6 text-sm text-gray-600">
                ลิงก์จะหมดอายุภายใน 30 นาที
              </p>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-3">ไม่ได้รับอีเมล?</p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            </div>
          ) : (
            // หน้าฟอร์ม
            <>
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
                ลืมรหัสผ่าน
              </h2>
              <p className="text-center text-sm text-gray-600 mb-8">
                กรุณากรอกอีเมลที่ใช้ลงทะเบียน
                เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้คุณ
              </p>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังส่ง...
                    </span>
                  ) : (
                    "ส่งลิงก์รีเซ็ตรหัสผ่าน"
                  )}
                </button>
              </form>
            </>
          )}

          {/* ลิงก์กลับไปหน้าล็อกอิน */}
          <div className="mt-6 text-center">
            <Link
              to="/Login"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetLink;
