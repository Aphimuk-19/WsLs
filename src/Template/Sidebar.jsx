import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import { Dropdown, Space, Badge, Menu } from "antd";
import {
  DownOutlined,
  BellOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Layout } from "antd";

const { Header, Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [headerText, setHeaderText] = useState("Dashboard");
  const [notifications] = useState([
    { key: "1", message: "New user registered" },
    { key: "2", message: "Product update available" },
    { key: "3", message: "New comment on your post" },
  ]);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [userRole, setUserRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); // state สำหรับ email
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก localStorage
  const updateUserData = () => {
    const role = localStorage.getItem("role");
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    const storedEmail = localStorage.getItem("email");

    setUserRole(role ? role.toLowerCase() : "user");
    setFirstName(storedFirstName || "");
    setLastName(storedLastName || ""); // ตั้งค่า lastName อย่างถูกต้อง
    setEmail(storedEmail || "");       // ตั้งค่า email อย่างถูกต้อง

    console.log("Sidebar User Role:", role);
    console.log("Sidebar FirstName:", storedFirstName);
    console.log("Sidebar LastName:", storedLastName);
    console.log("Sidebar Email:", storedEmail);
  };

  // เรียกใช้เมื่อโหลดครั้งแรก และเมื่อ localStorage เปลี่ยนแปลง
  useEffect(() => {
    updateUserData(); // ดึงข้อมูลครั้งแรก
    window.addEventListener("storage", updateUserData); // ฟังการเปลี่ยนแปลงใน localStorage

    return () => {
      window.removeEventListener("storage", updateUserData); // ล้าง event listener
    };
  }, []);

  const handleMenuClick = ({ key }) => {
    const menuMap = {
      1: "Dashboard",
      2: "Product",
      3: "ProductLocation",
      4: "Managelocation",
      5: "ManageUsers",
      6: "Account",
    };
    const selectedPage = menuMap[key] || "Dashboard";
    setHeaderText(selectedPage);
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    if (currentPage === "Dashboard") navigate("/Dashboard");
    if (currentPage === "Product") navigate("/Product");
    if (currentPage === "ProductLocation") navigate("/ProductLocation");
    if (currentPage === "Managelocation") navigate("/Managelocation");
    if (currentPage === "ManageUsers") navigate("/ManageUsers");
    if (currentPage === "Account") navigate("/Account");
  }, [currentPage, navigate]);

  const items = [
    !collapsed && {
      key: "Menu",
      label: <div style={{ padding: "0 16px", fontWeight: "bold", fontSize: "12px" }}>MENU</div>,
      disabled: true,
    },
    { key: "1", label: "Dashboard", icon: <PieChartOutlined /> },
    { key: "2", label: "Product", icon: <ShoppingCartOutlined /> },
    { key: "3", label: "Product Location", icon: <AppstoreOutlined /> },
    { key: "4", label: "Manage Location", icon: <DatabaseOutlined /> },
    ...(userRole === "admin" ? [{ key: "5", label: "Manage User", icon: <TeamOutlined /> }] : []),
    !collapsed && {
      key: "Other",
      label: <div style={{ padding: "0 16px", fontWeight: "bold", fontSize: "12px" }}>OTHER</div>,
      disabled: true,
    },
    { key: "6", label: "Accounts", icon: <UserOutlined /> },
  ].filter(Boolean);

  const item = [
    {
      key: "1",
      label: (
        <div className="flex items-center justify-center flex-col">
          <img
            src="/src/Image/man-4123268_1280.jpg"
            alt="Profile"
            style={{ width: "44px", height: "44px", marginBottom: "8px", borderRadius: "50%" }}
          />
          <div style={{ textAlign: "center" }}>
            <div>{firstName} {lastName}</div> {/* แสดง firstName และ lastName */}
            <div style={{ fontSize: "12px", color: "#888" }}>{email}</div> {/* แสดง email */}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "2",
      label: "Account",
      onClick: () => {
        setHeaderText("Account");
        setCurrentPage("Account");
      },
    },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email"); // ลบ email
        navigate("/Login");
      },
    },
  ];

  const notificationMenu = (
    <Menu>
      {notifications.length === 0 ? (
        <Menu.Item key="0">No new notifications</Menu.Item>
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
        style={{
          background: "#F1F2F7",
          transition: "width 0.2s",
        }}
      >
        <div
          style={{
            padding: "16px",
            color: "#000",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            border: "none",
          }}
        >
          <img
            src="/src/Image/Logocircle.png"
            alt="Logo"
            style={{ width: 53, height: 53, marginRight: "8px" }}
          />
          {!collapsed && (
            <span className="font-medium ml-[10px]">
              J.I.B. Computer <br /> Group
            </span>
          )}
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{
            background: "#F1F2F7",
            marginTop: "14px",
            border: "none",
          }}
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
            <span
              className="text-lg font-medium tracking-wide"
              style={{ marginLeft: "30px" }}
            >
              {headerText}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginRight: "30px",
            }}
          >
            <img
              src="/src/Image/man-4123268_1280.jpg"
              alt="Profile"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <Dropdown menu={{ items: item }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="text-[#1f384c] text-[16px] font-normal hover:text-blue-500">
                  {firstName} {lastName} {/* แสดง firstName และ lastName */}
                  <DownOutlined className="ml-2" style={{ fontSize: "10px" }} />
                </Space>
              </a>
            </Dropdown>

            <Dropdown overlay={notificationMenu} trigger={["click"]}>
              <Badge count={notifications.length} offset={[10, 0]}>
                <BellOutlined
                  style={{
                    fontSize: "20px",
                    color: "#1f384c",
                    cursor: "pointer",
                  }}
                />
              </Badge>
            </Dropdown>
          </div>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default Sidebar;