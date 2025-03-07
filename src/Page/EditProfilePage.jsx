import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const { userId, userData } = location.state || {};
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    email: '',
    phone: '',
    employeeId: '',
    role: '',
  });
  const [initialData, setInitialData] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null); // เปลี่ยนค่าเริ่มต้นเป็น null
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!token) {
          throw new Error('กรุณา login ใหม่: ไม่พบ token');
        }
        const response = await axios.get('http://172.18.43.37:3000/api/users/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data.data);
      } catch (err) {
        console.error('Fetch Current User Error:', err.response?.data || err.message);
        setError('ไม่สามารถดึงข้อมูลผู้ใช้: ' + (err.response?.data?.message || err.message));
      }
    };

    fetchCurrentUser();
  }, [token]);

  // ตั้งค่า formData
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        department: userData.department || '',
        email: userData.email || '',
        phone: userData.phone || userData.phoneNumber || '',
        employeeId: userData.employeeId || '',
        role: userData.role || '',
      });
      setProfileImageUrl(userData.profilePicture || null); // ถ้าไม่มีรูปให้เป็น null
      setInitialData(userData);
    } else if (currentUser && !userId) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        department: currentUser.department || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        employeeId: currentUser.employeeId || '',
        role: currentUser.role || '',
      });
      setProfileImageUrl(currentUser.profilePicture || null); // ถ้าไม่มีรูปให้เป็น null
      setInitialData(currentUser);
    } else if (userId && currentUser) {
      if (!userData) {
        setError('ไม่พบข้อมูลผู้ใช้สำหรับแก้ไข');
        setTimeout(() => navigate('/ManageUsers'), 2000);
      }
    } else {
      setError('ไม่พบข้อมูลผู้ใช้');
      setTimeout(() => navigate('/Account'), 2000);
    }
  }, [userId, userData, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      setError('กรุณากรอกชื่อและนามสกุล');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('กรุณากรอกเบอร์โทรศัพท์ 10 หลัก');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!token || !currentUser) {
        throw new Error('กรุณา login ใหม่: ไม่พบ token หรือข้อมูลผู้ใช้');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phone);
      if (currentUser.role === 'admin' && userId) {
        formDataToSend.append('role', formData.role);
      }

      if (profileImageFile) {
        formDataToSend.append('profilePicture', profileImageFile);
      }

      console.log('Data being sent to API:', Object.fromEntries(formDataToSend));

      const isEditingSelf = !userId || userId === currentUser.id;
      const url = isEditingSelf
        ? 'http://172.18.43.37:3000/api/users/profile/me'
        : `http://172.18.43.37:3000/api/users/profile/${userId}`;

      const response = await axios.put(
        url,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update Response:', response.data);

      const updatedData = response.data.data;
      setInitialData({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        department: updatedData.department,
        email: updatedData.email,
        phone: updatedData.phoneNumber || '',
        employeeId: updatedData.employeeId || '',
        role: updatedData.role || '',
      });
      setProfileImageUrl(updatedData.profilePicture || null);
      setProfileImageFile(null);
      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
        navigate(isEditingSelf ? '/Account' : '/ManageUsers');
      }, 1500);
    } catch (err) {
      console.error('Submit Error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('กรุณา login ใหม่: Token ไม่ถูกต้องหรือหมดอายุ');
        setTimeout(() => {
          localStorage.clear();
          navigate('/login');
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้');
      } else if (err.response?.status === 404) {
        setError('ไม่พบผู้ใช้สำหรับอัปเดต');
      } else {
        setError('เกิดข้อผิดพลาดในการบันทึก: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(userId && currentUser?.role === 'admin' ? '/ManageUsers' : '/Account');
  };

  if (!currentUser) return <div>Loading...</div>;

  // ดึงอักษรตัวแรกของชื่อ
  const initial = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-900">แก้ไขโปรไฟล์</h1>
            <p className="mt-1 text-sm text-gray-500">
              อัปเดตข้อมูลของ {formData.firstName} {formData.lastName}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="รูปโปรไฟล์"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md"
                    >
                      {initial}
                    </div>
                  )}
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
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

              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              {isSaved && <p className="text-green-600 text-sm mb-4">บันทึกข้อมูลสำเร็จ!</p>}
              {loading && <p className="text-gray-600 text-sm mb-4">กำลังโหลด...</p>}

              <div className="space-y-4">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสพนักงาน
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    disabled
                  />
                </div>
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
                      disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                {currentUser.role === 'admin' && userId && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภทผู้ใช้
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;