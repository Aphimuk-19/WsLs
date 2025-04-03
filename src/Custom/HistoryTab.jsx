import React, { useState, useEffect } from "react";
import { Button, Input, Space, Table, message } from "antd";
import { SearchOutlined, FilterOutlined, CopyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const HistoryTab = () => {
  const [historyData, setHistoryData] = useState([]);
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const loggedInEmployeeId = localStorage.getItem("employeeId"); // ดึง employeeId จาก localStorage

        if (!token) {
          message.error("กรุณาเข้าสู่ระบบก่อน");
          navigate("/");
          return;
        }

        if (!loggedInEmployeeId) {
          message.error("ไม่พบรหัสพนักงานของผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
          navigate("/");
          return;
        }

        const response = await fetch("http://172.18.43.37:3000/api/withdraw/exportpdfs", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            message.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
            localStorage.removeItem("authToken");
            localStorage.removeItem("employeeId");
            navigate("/");
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch data");
        }

        if (!Array.isArray(result.data)) {
          console.error("API response data is not an array:", result.data);
          throw new Error("ข้อมูลจาก API ไม่ใช่อาร์เรย์");
        }

        // กรองข้อมูลเฉพาะ employeeId ที่ตรงกับผู้ใช้ที่ล็อกอิน
        const filteredData = result.data.filter(
          (item) => item.employeeId === loggedInEmployeeId
        );

        // แปลงข้อมูลที่กรองแล้ว
        const transformedData = filteredData.map((item, index) => {
          const products = (item.items || []).map((productString) => {
            const match = productString.match(/^(.*)\s*\[(\d+)\]$/);
            return {
              name: match ? match[1].trim() : productString,
              quantity: match ? parseInt(match[2], 10) : 0,
            };
          });

          return {
            key: String(index + 1),
            requisitionNumber: item.billNumber || "ไม่ระบุ",
            date: item.withdrawDate || "ไม่ระบุวันที่",
            products: products.length > 0 ? products : [{ name: "ไม่ระบุชื่อสินค้า", quantity: 0 }],
            pdfUrl: item.pdfUrl || "",
            employeeId: item.employeeId || "ไม่ระบุ",
            requester: item.createdBy || "ไม่ระบุ",
          };
        });

        setHistoryData(transformedData);
      } catch (error) {
        console.error("Fetch error:", error);
        message.error(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message}`);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [navigate]);

  const handleHistorySearch = (value) => {
    setHistorySearchValue(value);
    if (value) {
      const filtered = historyData.filter(
        (item) =>
          item.products.some((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
          ) ||
          item.requisitionNumber.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHistoryData(filtered);
    } else {
      setFilteredHistoryData([]);
    }
  };

  const handleHistoryFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
    console.log("Filter toggled:", !isFilterOpen);
  };

  const handleOpenPDF = (record) => {
    if (!record.pdfUrl) {
      message.error("ไม่พบ URL ของ PDF สำหรับรายการนี้");
      return;
    }

    const baseUrl = "http://172.18.43.37:3000";
    const fullPdfUrl = `${baseUrl}${record.pdfUrl}`;
    window.open(fullPdfUrl, "_blank");
    message.success(`กำลังเปิด PDF สำหรับใบเบิก ${record.requisitionNumber}`);
  };

  const historyColumns = [
    { title: "หมายเลขใบเบิก", dataIndex: "requisitionNumber", key: "requisitionNumber" },
    { title: "วันที่", dataIndex: "date", key: "date" },
    {
      title: "สินค้า",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div>
          {products.map((product, index) => (
            <div key={index}>
              {product.name} (จำนวน: {product.quantity})
            </div>
          ))}
        </div>
      ),
    },
    { title: "รหัสพนักงาน", dataIndex: "employeeId", key: "employeeId" },
    { title: "ผู้ขอเบิก", dataIndex: "requester", key: "requester" },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <CopyOutlined
          onClick={() => handleOpenPDF(record)}
          style={{ cursor: "pointer", fontSize: "16px", color: "#1890ff" }}
        />
      ),
      width: 50,
    },
  ];

  return (
    <>
      <Space direction="horizontal" style={{ marginBottom: 16, display: "flex", gap: 35 }}>
        <Search
          placeholder="ค้นหาสินค้าหรือหมายเลขใบเบิก..."
          allowClear
          enterButton={<Button icon={<SearchOutlined />} />}
          onSearch={handleHistorySearch}
          onChange={(e) => handleHistorySearch(e.target.value)}
          style={{ width: 1120 }}
        />
        <Button
          icon={<FilterOutlined />}
          onClick={handleHistoryFilterClick}
          type="primary"
          style={{ backgroundColor: "#006ec4", borderColor: "#006ec4", width: 232 }}
        >
          ตัวกรอง
        </Button>
      </Space>

      <div className="w-[1400px]">
        <Table
          dataSource={historySearchValue ? filteredHistoryData : historyData}
          columns={historyColumns}
          pagination={false}
          bordered
          loading={loading}
        />
      </div>
    </>
  );
};

export default HistoryTab;