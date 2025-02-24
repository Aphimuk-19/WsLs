import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!employeeID || !password) {
      setError("กรุณากรอก Employee ID และรหัสผ่าน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://172.18.43.37:3000/api/login", {
        employeeId: employeeID, // ปรับให้ใช้ employeeId แทน employeeID
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("ล็อกอินสำเร็จ:", response.data);
        navigate("/Dashboard");
      } else {
        setError("ไม่ได้รับ token จาก API");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setError(
        err.response?.data?.message || "Employee ID หรือรหัสผ่านไม่ถูกต้อง"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-jib h-screen flex justify-center items-center">
      <div className="bg-[#ffffff] opacity-[0.85] rounded-[29px] w-[700px] h-[520px] shadow-[inset_5px_5px_4px_rgba(0,0,0,0.1)] p-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <p className="text-black text-[37.45px] font-bold uppercase">Login</p>
          <img
            className="w-[97px] h-[61.56px]"
            src="/src/Image/Logo png.png"
            alt="Logo"
          />
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
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
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
            <a className="text-[#1565f9]" href="#">
              ลืมรหัสผ่าน?
            </a>
          </div>

          <div>
            <button
              className={`w-[158.38px] h-[63.27px] bg-[#252265] rounded-[18.72px] text-white hover:bg-[#ffffff] hover:text-[#252265] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "กำลังโหลด..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;