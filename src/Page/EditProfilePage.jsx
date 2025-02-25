import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const EditProfilePage = () => {
  // ข้อมูลเริ่มต้น
  const initialData = {
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    department: 'แผนกพัฒนาซอฟต์แวร์',
    email: 'somchai@example.com',
    phone: '0812345678',
  };

  // State สำหรับฟอร์ม, รูปโปรไฟล์, และสถานะการบันทึก
  const [formData, setFormData] = useState(initialData);
  const [profileImage, setProfileImage] = useState('/api/placeholder/120/120');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  // ฟังก์ชันจัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ฟังก์ชันจัดการการอัปโหลดรูปโปรไฟล์
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName) {
      setError('กรุณากรอกชื่อและนามสกุล');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('กรุณากรอกเบอร์โทรศัพท์ 10 หลัก');
      return;
    }

    setError('');
    console.log('บันทึกข้อมูล:', { ...formData, profileImage });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // แจ้งเตือนหายไปหลัง 3 วินาที
    // สามารถเพิ่มการส่งข้อมูลไป API ที่นี่
  };

  // ฟังก์ชันยกเลิกการแก้ไข
  const handleCancel = () => {
    setFormData(initialData);
    setProfileImage('/api/placeholder/120/120');
    setError('');
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* หัวข้อ */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-900">แก้ไขโปรไฟล์</h1>
            <p className="mt-1 text-sm text-gray-500">อัปเดตข้อมูลส่วนตัวของคุณ</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              {/* รูปโปรไฟล์ */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <img
                    src={profileImage}
                    alt="รูปโปรไฟล์"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Camera size={16} />
                  </label>
                </div>
                <label
                  htmlFor="profileImage"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  เปลี่ยนรูปโปรไฟล์
                </label>
              </div>

              {/* ข้อความแจ้งเตือน */}
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              {isSaved && <p className="text-green-600 text-sm mb-4">บันทึกข้อมูลสำเร็จ!</p>}

              {/* ข้อมูลส่วนตัว */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    แผนก
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* ปุ่มการกระทำ */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;