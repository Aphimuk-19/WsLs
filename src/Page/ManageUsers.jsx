import React, { useState, useEffect } from "react";
import { Input, Tag, Select, Dropdown, Menu, message, Modal } from "antd";
import { SearchOutlined, DownOutlined, DeleteFilled } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          message.error("กรุณา login ใหม่: ไม่พบ token");
          navigate("/Login");
          return;
        }

        const response = await axios.get("http://172.18.43.37:3000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mappedData = response.data.data.map((user) => ({
          key: user.id,
          employeeId: user.employeeId || `EMP${Math.floor(Math.random() * 1000)}`,
          name: `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim(),
          image: user.profilePicture || "",
          email: user.email || "N/A",
          type: user.role || "user",
          status: "Active",
          id: user.id,
          department: user.department || "N/A",
          phoneNumber: user.phoneNumber || "N/A",
        }));

        setOriginalData(mappedData);
        setFilteredData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้: " + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  // ค้นหาผู้ใช้
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = originalData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // เปลี่ยนประเภทผู้ใช้
  const handleTypeChange = async (key, value) => {
    try {
      const user = filteredData.find((item) => item.key === key);
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("กรุณา login ใหม่: ไม่พบ token");
        navigate("/Login");
        return;
      }

      // ตรวจสอบว่า employeeId มีค่าไหม
      if (!user.employeeId) {
        message.error("ไม่พบ employeeId ของผู้ใช้");
        return;
      }

      // เรียก API ใหม่โดยใช้ employeeId
      await axios.put(
        `http://172.18.43.37:3000/api/role/change/${user.employeeId}`,
        { role: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, type: value } : item
        )
      );
      setOriginalData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, type: value } : item
        )
      );
      message.success("เปลี่ยนประเภทผู้ใช้สำเร็จ");
    } catch (error) {
      console.error("Error updating role:", error.response?.data || error.message);
      message.error(`เปลี่ยนประเภทผู้ใช้ล้มเหลว: ${error.response?.data?.message || error.message}`);
    }
  };

  // ลบผู้ใช้
  const handleDelete = (key) => {
    const user = filteredData.find((item) => item.key === key);
    confirm({
      title: "ยืนยันการลบผู้ใช้",
      content: `คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${user.name}" (ID: ${user.employeeId})?`,
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            message.error("กรุณา login ใหม่: ไม่พบ token");
            navigate("/Login");
            return;
          }
          await axios.delete(`http://172.18.43.37:3000/api/users/users/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFilteredData((prevData) => prevData.filter((item) => item.key !== key));
          setOriginalData((prevData) => prevData.filter((item) => item.key !== key));
          message.success("ลบผู้ใช้สำเร็จ");
        } catch (error) {
          console.error("Error deleting user:", error.response?.data || error.message);
          message.error("ลบผู้ใช้ล้มเหลว: " + (error.response?.data?.message || error.message));
        }
      },
    });
  };

  // แก้ไขผู้ใช้
  const handleEdit = (key) => {
    const user = filteredData.find((item) => item.key === key);
    navigate("/EditProfilePage", {
      state: {
        userId: user.id,
        userData: {
          employeeId: user.employeeId,
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ").slice(1).join(" ") || "",
          email: user.email,
          role: user.type,
          profilePicture: user.image,
          department: user.department,
          phoneNumber: user.phoneNumber,
        },
      },
    });
  };

  // แสดงสถานะในตาราง
  const getStatusTag = (status) => {
    return <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>;
  };

  // เมนูแก้ไขและลบ
  const menu = (key) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(key)}>
        แก้ไข
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(key)}>
        ลบ
      </Menu.Item>
    </Menu>
  );

  if (loading) return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="space-y-5 p-4 w-full max-w-7xl">
        <div className="flex justify-end space-x-4 mb-6">
          <Input
            style={{ width: "230px" }}
            value={searchQuery}
            onChange={handleSearch}
            placeholder="ค้นหาด้วยชื่อหรือ ID"
            prefix={<SearchOutlined />}
          />
        </div>

        <div className="px-4 p-4 w-full h-[60px] mb-4 bg-gray-100 rounded-[13.05px] shadow-sm">
          <div className="flex space-x-6 font-medium text-gray-700">
            <p className="flex-[2] text-center">ID</p>
            <p className="flex-[3] text-center">ชื่อ</p>
            <p className="flex-[3] text-center">อีเมล</p>
            <p className="flex-[2] text-center">ประเภท</p>
            <p className="flex-[2] text-center">สถานะ</p>
            <p className="flex-[1] text-center">
              <DeleteFilled />
            </p>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">ไม่พบข้อมูลผู้ใช้</div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.key}
              className="px-4 p-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
            >
              <div className="flex space-x-6 items-center">
                <div className="flex-[2] flex items-center justify-center">{item.employeeId}</div>
                <div className="flex-[3] flex items-center">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-10 flex-shrink-0 ml-[40px]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-left flex-1 min-w-0 truncate">{item.name}</span>
                  </div>
                </div>
                <div className="flex-[3] flex items-center justify-center truncate">{item.email}</div>
                <div className="flex-[2] flex items-center justify-center">
                  <Select
                    value={item.type}
                    onChange={(value) => handleTypeChange(item.key, value)}
                    style={{ width: "100px" }}
                    size="small"
                    bordered={false}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="user">User</Select.Option>
                  </Select>
                </div>
                <div className="flex-[2] flex items-center justify-center">
                  {getStatusTag(item.status)}
                </div>
                <div className="flex-[1] flex items-center justify-center">
                  <Dropdown overlay={menu(item.key)} trigger={["click"]}>
                    <span className="cursor-pointer text-gray-500 hover:text-blue-500">...</span>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageUsers;