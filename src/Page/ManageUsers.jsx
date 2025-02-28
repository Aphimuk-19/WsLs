import React, { useState, useEffect } from "react";
import { Input, Tag, Select, Dropdown, Menu, message } from "antd";
import { SearchOutlined, DownOutlined, DeleteFilled } from "@ant-design/icons";
import axios from "axios";

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://172.18.43.37:3000/api/users/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data.data); // ดูโครงสร้างข้อมูล

        const defaultImage = "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg";
        const mappedData = response.data.data.map((user, index) => ({
          key: String(index + 1),
          id: user.employeeId || `#876${364 + index}`, // ใช้ employeeId แทน user.id
          name: `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim(),
          image: user.profileImage || defaultImage,
          Email: user.email,
          type: user.role,
          status: "Active",
        }));

        setFilteredData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = filteredData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCheckboxChange = (key) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [key]: !prevSelected[key],
    }));
  };

  const handleTypeChange = (key, value) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, type: value } : item
      )
    );
    updateUserRole(key, value);
  };

  const updateUserRole = async (key, role) => {
    try {
      const user = filteredData.find((item) => item.key === key);
      console.log("Sending update for user:", { id: user.id, role }); // ตรวจสอบ id
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://172.18.43.37:3000/api/users/role-by-employee/${user.id}`, // เปลี่ยน URL
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Role updated for user ${user.id} to ${role}`);
      message.success("Success");
    } catch (error) {
      console.error("Error updating role:", error.response?.data || error.message);
      message.error("Failed to update role");
    }
  };

  const handleDelete = (key) => {
    setFilteredData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const getStatusTag = (status) => {
    const tagStyle = {
      width: "70px",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "24px",
    };
    return (
      <Tag color={status === "Active" ? "green" : "volcano"} style={tagStyle}>
        {status}
      </Tag>
    );
  };

  const menu = (key) => (
    <Menu>
      <Menu.Item key="delete" onClick={() => handleDelete(key)}>
        ลบ
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => console.log("Edit clicked")}>
        แก้ไข
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

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

        <div className="px-4 p-4 w-full h-[60px] mb-4">
          <div className="flex space-x-6">
            <p className="flex-[1] text-center">เลือก</p>
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

        {filteredData.map((item) => (
          <div
            key={item.key}
            className="px-4 p-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
          >
            <div className="flex space-x-6 items-center">
              <div className="flex-[1] flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedItems[item.key] || false}
                  onChange={() => handleCheckboxChange(item.key)}
                />
              </div>
              <div className="flex-[2] flex items-center justify-center">{item.id}</div>
              <div className="flex-[3] flex items-center">
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-10 flex-shrink-0 ml-[40px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <span className="text-left flex-1 min-w-0">{item.name}</span>
                </div>
              </div>
              <div className="flex-[3] flex items-center justify-center">{item.Email}</div>
              <div className="flex-[2] flex items-center justify-center">
                <div
                  style={{
                    borderRadius: "44.16px",
                    backgroundColor: item.type === "admin" ? "rgba(255, 213, 107, 0.1)" : "rgba(91, 146, 255, 0.1)",
                    border: "1px solid #d9d9d9",
                    width: "100px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Select
                    value={item.type}
                    onChange={(value) => handleTypeChange(item.key, value)}
                    style={{ width: "100%" }}
                    size="small"
                    bordered={false}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="user">User</Select.Option>
                  </Select>
                </div>
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
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;