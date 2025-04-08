import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { BASE_URL } from '../config/config'; // Add this import

function Exportpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems || [];
  const billnumber = location.state?.billnumber || "N/A";

  const handleGeneratePDF = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("กรุณาล็อกอินใหม่เพื่อดำเนินการต่อ");
      return;
    }

    const payload = {
      selectedItems,
      billnumber,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/generate-pdf`, { // Updated URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // รับไฟล์ PDF เป็น blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // เปิด PDF ในแท็บใหม่
      window.open(url, "_blank");

      // ปล่อย URL หลังจากใช้งานเสร็จ
      // window.URL.revokeObjectURL(url); // ถ้าต้องการให้ URL ใช้งานได้ต่อ ให้คอมเมนต์บรรทัดนี้

      alert("สร้าง PDF สำเร็จ!");
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigate("/Requisition"); // กลับไปหน้า Requisition
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mb-5 flex gap-3 items-center justify-end m-3">
        <Button
          onClick={handleGeneratePDF}
          type="primary"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export PDF
        </Button>
        <Button
          onClick={handleBack}
          style={{ width: 100, borderColor: "#000", color: "#000" }}
        >
          กลับ
        </Button>
      </div>
      <div
        className="mx-auto bg-white shadow-lg p-6"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          padding: "0 4rem",
        }}
      >
        <header className="text-center mb-5">
          <h1 className="text-[72px] font-bold">J.I.B</h1>
          <p className="text-lg">ใบเบิกสินค้า</p>
        </header>
        <div className="flex justify-between mb-6">
          <div>
            <p>สาขา: สาขาใหญ่</p>
            <p>หัวข้อ: เบิกทรัพย์สิน</p>
          </div>
          <div className="text-right">
            <p>เลขที่ใบเบิก: {billnumber}</p>
            <p>วันที่: {new Date().toLocaleDateString("th-TH")}</p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 my-6" />
        <div className="flex justify-between mb-2 font-bold">
          <p className="w-16 text-center">ลำดับ</p>
          <p className="flex-1 text-center">รายการ</p>
          <p className="w-16 text-right">จำนวน</p>
        </div>
        <div className="w-full h-[1px] bg-black my-4" />
        {selectedItems.map((row, index) => (
          <div key={index} className="flex justify-between mb-2 text-sm">
            <p className="w-16 text-center">{index + 1}</p>
            <p className="flex-1 text-center">{row.name}</p>
            <p className="w-16 text-right">{row.requestedQuantity}</p>
          </div>
        ))}
        <div className="w-full h-[1px] bg-black my-6" />
        <div className="flex flex-col items-end text-right gap-3 mt-20">
          <p>ชื่อ ...............................................</p>
          <p>วันที่ ............/............/................</p>
        </div>
      </div>
    </div>
  );
}

export default Exportpage;