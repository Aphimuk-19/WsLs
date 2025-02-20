import React, { useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Dropdown, Space, Badge, Menu } from "antd";
import { Link } from 'react-router-dom';
import {
  DownOutlined,
  BellOutlined,
  SettingOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { SpaceContext } from "antd/es/space";

const { Header, Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [headerText, setHeaderText] = useState("Dashboard"); // Header text state
  const [notifications] = useState([
    { key: "1", message: "New user registered" },
    { key: "2", message: "Product update available" },
    { key: "3", message: "New comment on your post" },
  ]);
  
  const [currentPage, setCurrentPage] = useState("Dashboard"); // Track the current page
  const navigate = useNavigate(); // useNavigate hook to perform navigation
  

  // Handle the menu click event and update the header text and navigate
  const handleMenuClick = ({ key }) => {
    const menuMap = {
      1: "Dashboard",
      2: "Product",
      3: "ProductLocation",
      4: "Managelocation",
      5: "ManageUsers",
      6: "Account",
    };
    const selectedPage = menuMap[key] || "Dashboard"; // Default to Dashboard if key not found
    setHeaderText(selectedPage);
    setCurrentPage(selectedPage); // Update the current page state
  };

  // Effectively trigger navigation when currentPage is updated
  React.useEffect(() => {
    if (currentPage === "Dashboard") navigate("/Dashboard");
    if (currentPage === "Product") navigate("/Product");
    if (currentPage === "ProductLocation") navigate("/ProductLocation");
    if (currentPage === "Managelocation") navigate("/Managelocation");
    if (currentPage === "ManageUsers") navigate("/ManageUsers");
    if (currentPage === "Account") navigate("/Account");
  }, [currentPage, navigate]); // Re-run navigation when currentPage changes

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
    { key: "5", label: "Manage User", icon: <TeamOutlined /> },
    !collapsed && {
      key: "Other",
      label: <div style={{ padding: "0 16px", fontWeight: "bold", fontSize: "12px" }}>OTHER</div>,
      disabled: true,
    },
    { key: "6", label: "Accounts", icon: <UserOutlined /> },
  ];

  const item = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <div onClick={handleMenuClick} style={{ cursor: "pointer" }}>
        Account
      </div>
      ),
    },
    {
      key: "3",
      label: "Settings",
      icon: <SettingOutlined />,
    },
  ];

  // Notification menu - you can dynamically render these messages
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
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }} // Adjust to be circular
            />
            <Dropdown menu={{ items: item }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="text-[#1f384c] text-[16px] font-normal hover:text-blue-500">
                  b.fernandes
                  <DownOutlined
                    className="ml-2"
                    style={{ fontSize: "10px" }}
                  />
                </Space>
              </a>
            </Dropdown>

            {/* Notification Dropdown */}
            <Dropdown
              overlay={notificationMenu} // Use overlay prop for menu
              trigger={['click']} // Trigger on click
            >
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
