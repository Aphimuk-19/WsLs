import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, message, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../config/config';

const Login = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันการ refresh หน้า
    if (!employeeID || !password) {
      setError("กรุณากรอก Employee ID และรหัสผ่าน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        employeeId: employeeID,
        password,
      });

      console.log("API Response:", response.data);

      // รองรับโครงสร้าง response ที่อาจต่างกัน
      const token = response.data.token || response.data.accessToken || response.data.data?.token;
      const user = response.data.user || response.data.data?.user;

      if (!token) {
        throw new Error("ไม่ได้รับ token จาก API");
      }

      // เก็บข้อมูลลง localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("employeeId", employeeID); // เก็บ employeeId จาก input
      localStorage.setItem("role", (user && user.role ? user.role.toLowerCase() : "user"));
      localStorage.setItem("firstName", (user && user.firstName ? user.firstName : ""));
      localStorage.setItem("lastName", (user && user.lastName ? user.lastName : ""));
      localStorage.setItem("email", (user && user.email ? user.email : ""));

      // Log ข้อมูลที่เก็บ
      console.log("Stored Token:", localStorage.getItem("authToken"));
      console.log("Stored EmployeeId:", localStorage.getItem("employeeId"));
      console.log("Stored Role:", localStorage.getItem("role"));
      console.log("Stored FirstName:", localStorage.getItem("firstName"));
      console.log("Stored LastName:", localStorage.getItem("lastName"));
      console.log("Stored Email:", localStorage.getItem("email"));

      message.success("ล็อกอินสำเร็จ! กำลังเปลี่ยนหน้า...");
      setTimeout(() => {
        navigate("/Dashboard");
        setEmployeeID("");
        setPassword("");
      }, 1500);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message || "Employee ID หรือรหัสผ่านไม่ถูกต้อง";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-jib h-screen flex justify-center items-center">
      <Spin spinning={loading} tip="กำลังโหลด...">
        <form onSubmit={handleLogin}>
          <div className="bg-[rgba(255,255,255,0.85)] rounded-[29px] w-[700px] h-[520px] shadow-[inset_5px_5px_4px_rgba(0,0,0,0.1)] p-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <p className="text-black text-[37.45px] font-bold uppercase">Login</p>
              <img className="w-[97px] h-[61.56px]" src="/src/Image/Logo png.png" alt="Logo" />
            </div>
            <p className="text-center text-black text-lg font-normal mb-5 mt-[-10px]">
              Warehouse Support & Location System
            </p>
            <div className="flex flex-col items-center gap-6 mt-10">
              <Input
                className="w-[464.94px] h-[70px] bg-[#fafafb] rounded-[18.72px]"
                type="text"
                placeholder=" Employee ID"
                prefix={<UserOutlined />}
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
                disabled={loading}
              />
              <Input.Password
                className="w-[464.94px] h-[70px] bg-[#fafafb] rounded-[18.72px]"
                placeholder=" password"
                prefix={<LockOutlined />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div className="flex items-center justify-center gap-1">
                <Link to="/Register" className="text-[#1565f9]">
                  ลงทะเบียน
                </Link>
                <p>หรือ</p>
                <Link to="/PasswordResetLink" className="text-[#1565f9]">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-[158.38px] h-[63.27px] bg-[#252265] rounded-[18.72px] text-white hover:bg-[#ffffff] hover:text-[#252265] flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Login"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Spin>
    </div>
  );
};

export default Login;