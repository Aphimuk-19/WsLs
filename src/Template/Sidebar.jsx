import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Space, Badge

, Menu } from "antd";
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
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/Login");
      return;
    }

    try {
      const response = await axios.get('http://172.18.43.37:3000/api/users/profile/me', {
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

      console.log("Fetched User Role:", userData.role);
      console.log("Fetched FirstName:", userData.firstName);
      console.log("Fetched LastName:", userData.lastName);
      console.log("Fetched Email:", userData.email);
      console.log("Fetched Profile Picture:", userData.profilePicture);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/Login");
      }
    }
  };

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

    console.log("Current Path:", currentPath);
    console.log("Set Current Page:", page);
  }, [location.pathname]);

  useEffect(() => {
    fetchUserProfile();
    window.addEventListener("storage", fetchUserProfile);
    return () => {
      window.removeEventListener("storage", fetchUserProfile);
    };
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
    console.log("Logo clicked, navigating to Dashboard");
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
    const selectedKey = pageToKeyMap[currentPage];
    console.log("Current Page:", currentPage, "Selected Key:", selectedKey);
    return selectedKey || "1";
  };

  const items = [
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
  ].filter(Boolean);

  const item = [
    {
      key: "1",
      label: (
        <div className="flex items-center justify-center flex-col">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              style={{
                width: "44px",
                height: "44px",
                marginBottom: "8px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="w-[44px] h-[44px] rounded-full bg-gray-400 flex items-center justify-center text-white font-bold mb-[8px]"
            >
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
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        setProfilePicture("");
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
            cursor: "pointer",
          }}
          onClick={handleLogoClick}
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
          mode="inline"
          selectedKeys={[getSelectedKey()]}
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
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="w-[50px] h-[50px] rounded-full bg-gray-400 flex items-center justify-center text-white font-bold"
              >
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