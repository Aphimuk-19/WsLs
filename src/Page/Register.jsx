import React, { useState } from "react";
import { Input, Select } from "antd";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      department: value,
    }));
  };

  const handleSubmit = () => {
    // ตรวจสอบค่าที่กรอกในฟอร์มเมื่อกดปุ่ม Sign Up
    console.log("Form Data Submitted:", formData);
    
    // คุณสามารถทำการตรวจสอบว่า `password` กับ `confirmPassword` ตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match.");
    } else {
      console.log("Passwords match!");
    }
    
    // ต่อไปคุณสามารถทำการส่งข้อมูลไปยังเซิร์ฟเวอร์
    // เช่น เรียก API ที่นี่
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center bg-jib">
      <div className="w-[1023px] h-[631px] bg-white/60 rounded-[32px] shadow-[7px_5px_10px_0px_rgba(0,0,0,0.60)] flex">
        {/* ด้านซ้าย */}
        <div className="w-1/2 h-full flex justify-center items-center bg-[#252265] rounded-tl-[32px] rounded-bl-[32px]">
          <img src="/src/Image/Logo.webp" />
        </div>

        {/* ด้านขวา */}
        <div className="w-1/2 h-full">
          <div className="flex flex-col justify-start items-center">
            <p className="text-black text-[37.45px] font-bold uppercase">Register</p>
            <p className="text-neutral-600 text-base font-normal">
              Warehouse Support & Location System
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 mb-3 mt-5">
            <Input
              name="firstName"
              placeholder="FirstName"
              className="input-style"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Input
              name="lastName"
              placeholder="LastName"
              className="input-style"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col justify-start items-center gap-3 ">
            <Select
              showSearch
              placeholder="Department"
              optionFilterProp="label"
              onChange={handleSelectChange}
              value={formData.department}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "tom", label: "Tom" },
              ]}
              className="input-style1"
            />
            <Input
              name="employeeId"
              placeholder="Employee ID"
              className="input-style1"
              value={formData.employeeId}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              placeholder="Email"
              className="input-style1"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              className="input-style1"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="input-style1"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="input-style1"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />

            <button
              className="w-[158.38px] h-[54px] bg-[#252265] rounded-[18.72px] text-white hover:bg-[#ffffff] hover:text-[#252265]"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
