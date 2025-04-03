import React, { useState, useEffect } from "react";
import { Button, Input, Space, Table, message } from "antd";
import { SearchOutlined, FilterOutlined, CopyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const ProductEntryTab = () => {
  const [productEntryData, setProductEntryData] = useState([]);
  const [entrySearchValue, setEntrySearchValue] = useState("");
  const [filteredEntryData, setFilteredEntryData] = useState([]);
  const [isEntryFilterOpen, setIsEntryFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductEntryData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const employeeId = localStorage.getItem("employeeId");

        if (!token || !employeeId) {
          message.error("กรุณาเข้าสู่ระบบก่อน");
          navigate("/");
          return;
        }

        console.log("Fetching data for employeeId:", employeeId); // ตรวจสอบ employeeId

        const response = await fetch(
          `http://172.18.43.37:3000/api/manage/impostpdfs?employeeId=${employeeId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            message.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
            localStorage.removeItem("authToken");
            localStorage.removeItem("employeeId");
            navigate("/");
            return;
          }
          if (response.status === 404) {
            message.warning("ไม่พบข้อมูลสำหรับผู้ใช้นี้");
            setProductEntryData([]);
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

        console.log("API response:", result.data); // ดูข้อมูลที่ API คืนมา

        // กรองข้อมูลเฉพาะ employeeId ของผู้ใช้
        const transformedData = result.data
          .filter((item) => item.employeeId === employeeId)
          .map((item, index) => {
            const products = (item.items || []).map((productString) => {
              const match = productString.match(/^(.*)\s*\[(\d+)\]$/);
              return {
                name: match ? match[1].trim() : productString,
                quantity: match ? parseInt(match[2], 10) : 0,
              };
            });

            return {
              key: String(index + 1),
              entryNumber: item.billNumber || "ไม่ระบุ",
              date: item.importDate || "ไม่ระบุวันที่",
              products: products.length > 0 ? products : [{ name: "ไม่ระบุชื่อสินค้า", quantity: 0 }],
              pdfUrl: item.pdfUrl || "",
            };
          });

        if (transformedData.length === 0) {
          message.info("ไม่มีข้อมูลสำหรับผู้ใช้นี้");
        }
        setProductEntryData(transformedData);
      } catch (error) {
        console.error("Fetch error:", error);
        message.error(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message}`);
        setProductEntryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductEntryData();
  }, [navigate]);

  const handleEntrySearch = (value) => {
    setEntrySearchValue(value);
    if (value) {
      const filtered = productEntryData.filter((item) =>
        item.products.some((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredEntryData(filtered);
    } else {
      setFilteredEntryData([]);
    }
  };

  const handleEntryFilterClick = () => {
    setIsEntryFilterOpen(!isEntryFilterOpen);
    console.log("Entry Filter toggled:", !isEntryFilterOpen);
  };

  const handleOpenPDF = (record) => {
    if (!record.pdfUrl) {
      message.error("ไม่พบ URL ของ PDF สำหรับรายการนี้");
      return;
    }

    const baseUrl = "http://172.18.43.37:3000";
    const fullPdfUrl = `${baseUrl}${record.pdfUrl}`;
    window.open(fullPdfUrl, "_blank");
    message.success(`กำลังเปิด PDF สำหรับหมายเลขการเข้า ${record.entryNumber}`);
  };

  const entryColumns = [
    { title: "หมายเลขการเข้า", dataIndex: "entryNumber", key: "entryNumber" },
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
          placeholder="ค้นหาสินค้า..."
          allowClear
          enterButton={<Button icon={<SearchOutlined />} />}
          onSearch={handleEntrySearch}
          onChange={(e) => handleEntrySearch(e.target.value)}
          style={{ width: 1120 }}
        />
        <Button
          icon={<FilterOutlined />}
          onClick={handleEntryFilterClick}
          type="primary"
          style={{ backgroundColor: "#006ec4", borderColor: "#006ec4", width: 232 }}
        >
          ตัวกรอง
        </Button>
      </Space>

      <div className="w-[1400px]">
        <Table
          dataSource={entrySearchValue ? filteredEntryData : productEntryData}
          columns={entryColumns}
          pagination={false}
          bordered
          loading={loading}
        />
      </div>
    </>
  );
};

export default ProductEntryTab;