import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Space, Badge, Menu } from "antd";
import { BASE_URL } from '../config/config';
import {
  DownOutlined,
  SwapOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Layout } from "antd";
import axios from 'axios';
import Logo from '../Image/Logocircle.png'; // แก้ไขการ import รูปภาพ

const { Header, Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [headerText, setHeaderText] = useState("Dashboard");
  const [notifications] = useState([
    { key: "1", message: "New user registered" },
    { key: "2", message: "Product update available" },
    { key: "3", message: "New comment on your post" },
  ]);
  const [currentPage, setCurrentPage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading
  const navigate = useNavigate();
  const location = useLocation();

  // ฟังก์ชันดึงข้อมูลโปรไฟล์ผู้ใช้
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/Login");
      return;
    }

    setLoading(true); // เริ่ม loading
    try {
      const response = await axios.get(`${BASE_URL}/api/users/profile/me`, { // แก้ไข URL
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;

      setUserRole(userData.role ? userData.role.toLowerCase() : "user");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email || "");
      setProfilePicture(userData.profilePicture || "");

      localStorage.setItem("role", userData.role || "");
      localStorage.setItem("firstName", userData.firstName || "");
      localStorage.setItem("lastName", userData.lastName || "");
      localStorage.setItem("email", userData.email || "");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/Login");
      } else {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์:", error.message);
      }
    } finally {
      setLoading(false); // สิ้นสุด loading
    }
  };

  // ตั้งค่า page ปัจจุบัน
  useEffect(() => {
    const pathToPageMap = {
      "/Dashboard": "Dashboard",
      "/Requisition": "Requisition",
      "/ProductLocation": "ProductLocation",
      "/ManageLocation": "ManageLocation",
      "/ProductTransfer": "ProductTransfer",
      "/ManageUsers": "ManageUsers",
      "/Account": "Account",
    };

    const currentPath = location.pathname;
    const page = pathToPageMap[currentPath] || "Dashboard";
    setCurrentPage(page);
    setHeaderText(page);
  }, [location.pathname]);

  // ดึงข้อมูลโปรไฟล์เมื่อเริ่มต้น
  useEffect(() => {
    fetchUserProfile();
    window.addEventListener("storage", fetchUserProfile);
    return () => window.removeEventListener("storage", fetchUserProfile);
  }, []);

  const handleMenuClick = ({ key }) => {
    const menuMap = {
      1: "Dashboard",
      3: "ProductLocation",
      4: "ManageLocation",
      5: "ProductTransfer",
      2: "Requisition",
      6: "ManageUsers",
      7: "Account",
    };
    const selectedPage = menuMap[key] || "Dashboard";
    setHeaderText(selectedPage);
    setCurrentPage(selectedPage);
    navigate(`/${selectedPage}`);
  };

  const handleLogoClick = () => {
    setHeaderText("Dashboard");
    setCurrentPage("Dashboard");
    navigate("/Dashboard");
  };

  const getSelectedKey = () => {
    const pageToKeyMap = {
      "Dashboard": "1",
      "ProductLocation": "3",
      "ManageLocation": "4",
      "ProductTransfer": "5",
      "Requisition": "2",
      "ManageUsers": "6",
      "Account": "7",
    };
    return pageToKeyMap[currentPage] || "1";
  };

  // ใช้ useMemo เพื่อเพิ่มประสิทธิภาพ
  const items = useMemo(() => [
    !collapsed && {
      key: "Menu",
      label: <div style={{ padding: "0 16px", fontWeight: "bold", fontSize: "12px" }}>MENU</div>,
      disabled: true,
    },
    { key: "1", label: "Dashboard", icon: <PieChartOutlined /> },
    { key: "3", label: "Product Location", icon: <AppstoreOutlined /> },
    { key: "4", label: "Manage Location", icon: <DatabaseOutlined /> },
    { key: "5", label: "Product Transfer", icon: <SwapOutlined /> },
    { key: "2", label: "Requisition", icon: <FileTextOutlined /> },
    ...(userRole === "admin" ? [{ key: "6", label: "Manage User", icon: <TeamOutlined /> }] : []),
    !collapsed && {
      key: "Other",
      label: <div style={{ padding: "0 16px", fontWeight: "bold", fontSize: "12px" }}>OTHER</div>,
      disabled: true,
    },
    { key: "7", label: "Accounts", icon: <UserOutlined /> },
  ].filter(Boolean), [collapsed, userRole]);

  const item = [
    {
      key: "1",
      label: (
        <div className="flex items-center justify-center flex-col">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" style={{ width: "44px", height: "44px", marginBottom: "8px", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div className="w-[44px] h-[44px] rounded-full bg-gray-400 flex items-center justify-center text-white font-bold mb-[8px]">
              {firstName.charAt(0)}
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <div>{firstName} {lastName}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>{email}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "2",
      label: "Account",
      icon: <UserOutlined />,
      onClick: () => {
        setHeaderText("Account");
        setCurrentPage("Account");
        navigate("/Account");
      },
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.clear();
        setProfilePicture("");
        navigate("/Login");
      },
    },
  ];

  const notificationMenu = (
    <Menu>
      {notifications.length === 0 ? (
        <Menu.Item key="0">ไม่มีแจ้งเตือนใหม่</Menu.Item>
      ) : (
        notifications.map((notification) => (
          <Menu.Item key={notification.key}>{notification.message}</Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#000" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={237}
        collapsedWidth={90}
        style={{ background: "#F1F2F7", transition: "width 0.2s" }}
      >
        <div
          style={{ padding: "16px", color: "#000", fontWeight: "bold", display: "flex", alignItems: "center", border: "none", cursor: "pointer" }}
          onClick={handleLogoClick}
        >
          <img src={Logo} alt="Logo" style={{ width: 53, height: 53, marginRight: "8px" }} />
          {!collapsed && (
            <span className="font-medium ml-[10px]">
              J.I.B. Computer <br /> Group
            </span>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={items}
          style={{ background: "#F1F2F7", marginTop: "14px", border: "none" }}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#f5f5f5",
            borderBottom: "1px solid #C8CBD9",
            height: "80px",
            lineHeight: "80px",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="text-lg font-medium tracking-wide" style={{ marginLeft: "30px" }}>
              {headerText}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginRight: "30px" }}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div className="w-[50px] h-[50px] rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                {firstName.charAt(0)}
              </div>
            )}
            <Dropdown menu={{ items: item }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="text-[#1f384c] text-[16px] font-normal hover:text-blue-500">
                  {firstName}
                  <DownOutlined className="ml-2" style={{ fontSize: "10px" }} />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default Sidebar;