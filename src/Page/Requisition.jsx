import React, { useState, useEffect } from "react";
import { message } from "antd"; // เพิ่มการนำเข้า message จาก Ant Design
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate เพื่อการเปลี่ยนเส้นทาง
import RequisitionTab from "../Custom/RequisitionTab";
import HistoryTab from "../Custom/HistoryTab";
import ProductEntryTab from "../Custom/ProductEntryTab";

const Requisition = () => {
  const [activeTab, setActiveTab] = useState("requisition");
  const [requisitionData, setRequisitionData] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequisitionData, setFilteredRequisitionData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // เพิ่มตัวแปร navigate

  // Fetch Requisition Data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const employeeId = localStorage.getItem("employeeId");

        // ตรวจสอบการยืนยันตัวตน
        if (!token || !employeeId) {
          message.error("กรุณาเข้าสู่ระบบก่อน");
          navigate("/");
          return;
        }

        const response = await fetch("http://172.18.43.37:3000/api/cell/cellsAll", {
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
        console.log("API response:", result); // ตรวจสอบโครงสร้างข้อมูล

        // ตรวจสอบว่า API ส่งคืนข้อมูลในรูปแบบที่ถูกต้องหรือไม่
        if (!result.success || !Array.isArray(result.data)) {
          console.error("API response is invalid or data is not an array:", result);
          throw new Error("ข้อมูลจาก API ไม่ถูกต้องหรือไม่ใช่อาร์เรย์");
        }

        // แปลงข้อมูลจาก result.data
        const formattedData = result.data.map((item, index) => ({
          key: String(index + 1),
          no: String(index + 1),
          id: item.id || `#${index + 876364}`,
          type: item.type || "Unknown",
          name: item.name || "Unknown",
          image: item.image || "https://via.placeholder.com/40",
          location: item.location || "Unknown",
          in: item.in || "N/A",
          end: item.end || "N/A",
          quantity: item.quantity || 0,
        }));

        setRequisitionData(formattedData);
        setFilteredRequisitionData(formattedData);
        setQuantities(formattedData.map(() => 0));
      } catch (error) {
        console.error("Error fetching requisition data:", error);
        message.error(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message}`);
        setRequisitionData([]);
        setFilteredRequisitionData([]);
        setQuantities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // เพิ่ม navigate เป็น dependency

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex items-center justify-start gap-6 mb-3 w-full ml-[14rem]">
        <button
          onClick={() => setActiveTab("requisition")}
          className={`text-xl font-bold ${
            activeTab === "requisition"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          เบิกสินค้า
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`text-xl font-bold ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          ประวัติการเบิก
        </button>
        <button
          onClick={() => setActiveTab("productEntry")}
          className={`text-xl font-bold ${
            activeTab === "productEntry"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          ประวัติการเข้าข้อมูลสินค้า
        </button>
      </div>

      <div className="w-[1400px] h-[1px] bg-[#dcdcdc] mb-4"></div>

      {loading && activeTab === "requisition" && (
        <div>Loading requisition data...</div>
      )}

      {!loading && activeTab === "requisition" && (
        <RequisitionTab
          requisitionData={requisitionData}
          quantities={quantities}
          setQuantities={setQuantities}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredRequisitionData={filteredRequisitionData}
          setFilteredRequisitionData={setFilteredRequisitionData}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}

      {activeTab === "history" && <HistoryTab />}

      {activeTab === "productEntry" && <ProductEntryTab />}
    </div>
  );
};

export default Requisition;