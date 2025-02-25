import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่มการ import useNavigate

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const navigate = useNavigate(); // เพิ่ม hook สำหรับการนำทาง

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0: return 'ว่าง';
      case 1: return 'อ่อนมาก';
      case 2: return 'อ่อน';
      case 3: return 'ปานกลาง';
      case 4: return 'แข็งแรง';
      case 5: return 'แข็งแรงมาก';
      default: return 'ว่าง';
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
    if (!/[A-Z]/.test(password)) errors.push('รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว');
    if (!/[a-z]/.test(password)) errors.push('รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว');
    if (!/[0-9]/.test(password)) errors.push('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว');
    return errors;
  };

  useEffect(() => {
    setPasswordMismatch(formData.password !== formData.confirmPassword && formData.confirmPassword !== '');
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) newErrors.password = passwordErrors;
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = ['รหัสผ่านไม่ตรงกัน'];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // นำทางไปหน้า login หลังจากบันทึกสำเร็จ
      setTimeout(() => {
        navigate('/Login');
      }, 1000); // รอ 1 วินาทีก่อนเปลี่ยนหน้า (เพื่อให้เห็นหน้าสำเร็จ)
    }, 1500); // จำลองการส่งข้อมูล
  };

  const isFormValid = () => {
    const passwordErrors = validatePassword(formData.password);
    return passwordErrors.length === 0 && formData.password === formData.confirmPassword && formData.password !== '';
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const checkConditions = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password)
  });

  const conditions = checkConditions(formData.password);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          {!isSuccess ? (
            <>
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">ตั้งรหัสผ่านใหม่</h2>
              <p className="text-center text-sm text-gray-600 mb-8">กรุณาตั้งรหัสผ่านใหม่ของคุณ</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <div className="mt-2 text-sm text-red-600">{errors.password.join(', ')}</div>
                  )}

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 font-medium">รหัสผ่านต้องประกอบด้วย:</p>
                    <ul className="mt-1 space-y-1">
                      <li className={`text-sm flex items-center ${conditions.length ? 'text-green-600' : 'text-gray-600'}`}>
                        {conditions.length ? (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        ความยาวอย่างน้อย 8 ตัวอักษร
                      </li>
                      <li className={`text-sm flex items-center ${conditions.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                        {conditions.uppercase ? (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        ตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว
                      </li>
                      <li className={`text-sm flex items-center ${conditions.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                        {conditions.lowercase ? (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        ตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว
                      </li>
                      <li className={`text-sm flex items-center ${conditions.number ? 'text-green-600' : 'text-gray-600'}`}>
                        {conditions.number ? (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        ตัวเลขอย่างน้อย 1 ตัว
                      </li>
                    </ul>
                  </div>

                  {formData.password && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-600 mb-1">
                        ความแข็งแรงของรหัสผ่าน: 
                        <span className={`ml-1 font-medium ${passwordStrength >= 4 ? 'text-green-600' : passwordStrength >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="flex h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-full w-1/5 ${level <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordMismatch ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  {passwordMismatch && (
                    <div className="mt-2 flex items-center text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">รหัสผ่านไม่ตรงกัน</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-md font-medium transition duration-150 ${
                    isFormValid() && !isSubmitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      : 'bg-blue-600 text-white opacity-70 cursor-not-allowed'
                  }`}
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="mt-3 text-xl font-bold text-gray-800">เปลี่ยนรหัสผ่านสำเร็จ</h2>
              <p className="mt-2 text-sm text-gray-600">
                รหัสผ่านของคุณได้รับการเปลี่ยนเรียบร้อยแล้ว กำลังนำคุณไปที่หน้าเข้าสู่ระบบ...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;