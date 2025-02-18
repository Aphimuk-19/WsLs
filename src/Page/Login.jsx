import React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const Login = () => {
  return (
    <div className="bg-jib h-screen flex justify-center items-center">
      <div className="bg-[#ffffff] opacity-[0.85] rounded-[29px] w-[700px] h-[520px] shadow-[inset_5px_5px_4px_rgba(0,0,0,0.1)] p-8">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <p className="text-black text-[37.45px] font-bold uppercase">Login</p>
          <img
            className="w-[97px] h-[61.56px]"
            src="/src/Image/Logo png.png"
            alt="Logo"
          />
        </div>

        {/* Description */}
        <p className="text-center text-black text-lg font-normal mb-5 mt-[-10px]">
          Warehouse Support & Location System
        </p>

        {/* Inputs Section */}
        <div className="flex flex-col items-center gap-6 mt-10">
          <Input
            className="w-[464.94px] h-[70px] bg-[#fafafb] rounded-[18.72px]"
            type="text"
            placeholder=" UserName"
            prefix={<UserOutlined />}
          />

          {/* Password Input with Lock Icon as Prefix */}
          <Input.Password
            className="w-[464.94px] h-[70px] bg-[#fafafb] rounded-[18.72px]"
            type="Password"
            size="large"
            placeholder=" password"
            prefix={<LockOutlined />} // Lock icon prefix
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />

          {/* Links for registration and forgot password */}
          <div className="flex items-center justify-center gap-1">
            <a className="text-[#1565f9]" href="#">
              ลงทะเบียน
            </a>
            <p>หรือ</p>
            <a className="text-[#1565f9]" href="#">
              ลืมรหัสผ่าน?
            </a>
          </div>

          {/* Login Button without opacity */}
          <div>
            <button className="w-[158.38px] h-[63.27px] bg-[#252265] rounded-[18.72px] text-white hover:bg-[#ffffff] hover:text-[#252265]">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
