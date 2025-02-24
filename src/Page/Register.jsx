import React, { useState } from "react";
import { Input, Select } from "antd";
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate แทน useHistory

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

  const [error, setError] = useState("");
  const navigate = useNavigate(); // ใช้ useNavigate

  // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลงของ input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลงของ Select (Department)
  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      department: value,
    }));
  };

  // ฟังก์ชันสำหรับการสมัครสมาชิก
  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }

    setError(""); // เคลียร์ข้อผิดพลาดก่อนที่จะส่งข้อมูล

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch("http://172.18.43.37:3000/api/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // ส่งข้อมูล formData
      });

      // ตรวจสอบสถานะของการตอบกลับ
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      
      // เปลี่ยนเส้นทางไปยังหน้า Login หลังจากสมัครเสร็จ
      navigate("/Login"); // ใช้ navigate 
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Error:", error);
    }
  };

  // ฟังก์ชันที่ใช้ตรวจสอบความถูกต้องของฟอร์ม
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center bg-jib">
      <div className="w-[1023px] h-[631px] bg-white/60 rounded-[32px] shadow-[7px_5px_10px_0px_rgba(0,0,0,0.60)] flex">
        <div className="w-1/2 h-full flex justify-center items-center bg-[#252265] rounded-tl-[32px] rounded-bl-[32px]">
          <img src="/src/Image/Logo.webp" alt="Logo" />
        </div>
        <div className="w-1/2 h-full">
          <div className="flex flex-col justify-start items-center">
            <p className="text-black text-[37.45px] font-bold uppercase">Register</p>
            <p className="text-neutral-600 text-base font-normal">
              Warehouse Support & Location System
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* แสดงข้อความข้อผิดพลาด */}
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
              disabled={!isFormValid()} // ปิดปุ่มเมื่อฟอร์มไม่ถูกต้อง
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
