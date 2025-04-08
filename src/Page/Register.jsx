import React, { useState } from "react";
import { Input, Select, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../config/config'; // Add this import

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    // ตรวจสอบว่ากรอกครบทุกฟิลด์
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.department ||
      !formData.employeeId ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("กรุณากรอกข้อมูลทุกช่อง");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");
      return;
    }

    if (!/^\d+$/.test(formData.employeeId)) {
      setError("รหัสพนักงานต้องเป็นตัวเลขเท่านั้น");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/Register`, { // Updated URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Network response was not ok");
      }

      console.log("Success:", data);
      message.success("สมัครสมาชิกสำเร็จ! กำลังเปลี่ยนไปหน้า login...");
      setTimeout(() => {
        navigate("/Login");
      }, 1500);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message || "การสมัครสมาชิกผิดพลาด กรุณาลองใหม่");
      message.error(error.message || "การสมัครสมาชิกผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.department &&
      formData.employeeId &&
      /^\d+$/.test(formData.employeeId) &&
      formData.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phoneNumber &&
      /^\d{10}$/.test(formData.phoneNumber) &&
      formData.password &&
      formData.confirmPassword &&
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
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <div className="flex items-center justify-center gap-4 mb-3 mt-5">
            <Input
              name="firstName"
              placeholder="ชื่อ"
              className="input-style"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Input
              name="lastName"
              placeholder="นามสกุล"
              className="input-style"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col justify-start items-center gap-3">
            <Select
              showSearch
              placeholder="แผนก"
              optionFilterProp="label"
              onChange={handleSelectChange}
              value={formData.department || undefined} // เพื่อให้แสดง placeholder ถ้ายังไม่เลือก
              options={[
                { value: "บัญชี", label: "บัญชี" },
                { value: "คลังสินค้า", label: "คลังสินค้า" },
                { value: "ธุรการ", label: "ธุรการ" },
                { value: "ทรัพยากรบุคคล", label: "ทรัพยากรบุคคล" },
                { value: "MIS", label: "MIS" },
                { value: "MIT", label: "MIT" },
                { value: "การตลาด", label: "การตลาด" },
                { value: "จัดซื้อ", label: "จัดซื้อ" },
                { value: "การเงิน", label: "การเงิน" },
              ]}
              className="input-style1"
            />
            <Input
              name="employeeId"
              placeholder="รหัสพนักงาน"
              className="input-style1"
              value={formData.employeeId}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              placeholder="อีเมล"
              className="input-style1"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="phoneNumber"
              placeholder="เบอร์โทรศัพท์ (10 หลัก)"
              className="input-style1"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="รหัสผ่าน"
              className="input-style1"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              className="input-style1"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              className="w-[158.38px] h-[54px] bg-[#252265] rounded-[18.72px] text-white hover:bg-[#ffffff] hover:text-[#252265] flex items-center justify-center"
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
            >
              {loading ? <Spin size="small" /> : "สมัครสมาชิก"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;