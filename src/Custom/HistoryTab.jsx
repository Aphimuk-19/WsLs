import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Space, Table, message, DatePicker } from "antd";
import { SearchOutlined, FilterOutlined, CopyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // Use dayjs
import "dayjs/locale/en"; // Import English locale for dayjs
import locale from "antd/es/date-picker/locale/en_US"; // Ant Design English locale

// Set dayjs to use English locale
dayjs.locale("en");

const { Search } = Input;

const HistoryTab = () => {
  const [historyData, setHistoryData] = useState([]);
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // State to control DatePicker visibility
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const filterButtonRef = useRef(null); // Ref to the filter button

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const loggedInEmployeeId = localStorage.getItem("employeeId");

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

        const filteredData = result.data.filter(
          (item) => item.employeeId === loggedInEmployeeId
        );

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

  // Function to parse Thai date format "DD เดือน YYYY" to a dayjs object
  const parseThaiDate = (thaiDate) => {
    if (thaiDate === "ไม่ระบุวันที่") return null;

    const thaiMonths = {
      "มกราคม": 1,
      "กุมภาพันธ์": 2,
      "มีนาคม": 3,
      "เมษายน": 4,
      "พฤษภาคม": 5,
      "มิถุนายน": 6,
      "กรกฎาคม": 7,
      "สิงหาคม": 8,
      "กันยายน": 9,
      "ตุลาคม": 10,
      "พฤศจิกายน": 11,
      "ธันวาคม": 12,
    };

    const [day, month, year] = thaiDate.split(" ");
    const monthNumber = thaiMonths[month];
    if (!monthNumber) return null;

    // Convert Thai Buddhist year (e.g., 2568) to Gregorian year (e.g., 2025)
    const gregorianYear = parseInt(year, 10) - 543;

    return dayjs(`${gregorianYear}-${monthNumber}-${day}`, "YYYY-M-D");
  };

  const handleHistorySearch = (value) => {
    setHistorySearchValue(value);
    applyFilters(value, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    applyFilters(historySearchValue, date);
    setIsDatePickerOpen(false); // Close the DatePicker after selecting a date
  };

  const applyFilters = (searchValue, date) => {
    let filtered = [...historyData];

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.products.some((product) =>
            product.name.toLowerCase().includes(searchValue.toLowerCase())
          ) ||
          item.requisitionNumber.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      filtered = filtered.filter((item) => {
        const itemDate = parseThaiDate(item.date);
        if (!itemDate) return false;
        return itemDate.isSame(formattedDate, "day");
      });
    }

    setFilteredHistoryData(filtered);
  };

  const handleHistoryFilterClick = () => {
    setIsDatePickerOpen(true); // Open the DatePicker when the filter button is clicked
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
        <div style={{ position: "relative" }}>
          <Button
            ref={filterButtonRef}
            icon={<FilterOutlined />}
            onClick={handleHistoryFilterClick}
            type="primary"
            style={{ backgroundColor: "#006ec4", borderColor: "#006ec4", width: 232 }}
          >
            ตัวกรอง
          </Button>
          <DatePicker
            open={isDatePickerOpen}
            onChange={handleDateChange}
            onOpenChange={(open) => setIsDatePickerOpen(open)} // Update state when DatePicker opens/closes
            format="DD/MM/YYYY"
            locale={locale}
            getPopupContainer={() => filterButtonRef.current} // Position the DatePicker relative to the button
            style={{ position: "absolute", visibility: "hidden" }} // Hide the input field
          />
        </div>
      </Space>

      <div className="w-[1400px]">
        <Table
          dataSource={historySearchValue || selectedDate ? filteredHistoryData : historyData}
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