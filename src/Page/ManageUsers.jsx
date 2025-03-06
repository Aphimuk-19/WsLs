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
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://172.18.43.37:3000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data.data);

        const defaultImage = "";
        const mappedData = response.data.data.map((user, index) => ({
          key: String(index + 1),
          employeeId: user.employeeId || `#876${364 + index}`,
          name: `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim(),
          image: user.profilePicture || defaultImage,
          Email: user.email,
          type: user.role,
          status: "Active",
          id: user.id,
          department: user.department || "",
          phone: user.phoneNumber || "",
        }));

        setOriginalData(mappedData);
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
    const filtered = originalData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(query.toLowerCase())
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
    updateUserRole(key, value);
  };

  const updateUserRole = async (key, role) => {
    try {
      const user = filteredData.find((item) => item.key === key);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://172.18.43.37:3000/api/role/change/${user.employeeId}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Role updated for user ${user.employeeId} to ${role}`);

      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, type: role } : item
        )
      );
      setOriginalData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, type: role } : item
        )
      );
      message.success("Success");
    } catch (error) {
      console.error("Error updating role:", error.response?.data || error.message);
      message.error(`Failed: ${error.response?.data.message || error.message}`);
    }
  };

  const handleDelete = (key) => {
    const user = filteredData.find((item) => item.key === key);
    if (!user) {
      console.error("User not found for key:", key);
      return;
    }

    confirm({
      title: 'ยืนยันการลบผู้ใช้',
      content: `คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${user.name}" (ID: ${user.employeeId})?`,
      okText: 'ตกลง',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.delete(
            `http://172.18.43.37:3000/api/users/users/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` }, data: { id: user.id } }
          );
          console.log(`User ${user.id} deleted successfully:`, response.data);
          setFilteredData((prevData) => prevData.filter((item) => item.key !== key));
          setOriginalData((prevData) => prevData.filter((item) => item.key !== key));
          message.success("ลบผู้ใช้สำเร็จ");
        } catch (error) {
          console.error("Error deleting user:", error.response?.data || error.message);
          message.error("ลบผู้ใช้ล้มเหลว: " + (error.response?.data.message || error.message));
        }
      },
      onCancel() {
        console.log("ยกเลิกการลบผู้ใช้:", user.id);
      },
    });
  };

  const handleEdit = (key) => {
    const user = filteredData.find((item) => item.key === key);
    if (!user) {
      console.error("User not found for key:", key);
      return;
    }
    navigate("/EditProfilePage", {
      state: {
        userId: user.id,
        userData: {
          employeeId: user.employeeId,
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ").slice(1).join(" ") || "",
          email: user.Email,
          role: user.type,
          profilePicture: user.image,
          department: user.department,
          phone: user.phone,
        }
      }
    });
    console.log("Navigating to EditProfilePage for user:", user.id);
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
    return <Tag color={status === "Active" ? "green" : "volcano"} style={tagStyle}>{status}</Tag>;
  };

  const menu = (key) => (
    <Menu>
      <Menu.Item key="delete" onClick={() => handleDelete(key)}>
        ลบ
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleEdit(key)}>
        แก้ไข
      </Menu.Item>
    </Menu>
  );

  if (loading) return <div>Loading...</div>;

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
                      <div
                        className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold"
                      >
                        {item.name.charAt(0)}
                      </div>
                    )}
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