import React from "react";
import { jsPDF } from "jspdf";


function ExportPage() {
  const data = [
    { item: "Asus Vivobook", quantity: 5 },
    { item: "Asus Vivobook", quantity: 10 },
    { item: "Dell XPS", quantity: 3 },
    { item: "MacBook Pro", quantity: 2 },
  ];

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // เพิ่มฟอนต์ภาษาไทย
     
      // Header
      doc.setFontSize(72);
      doc.text("J.I.B", 105, 20, { align: "center" });
      doc.setFontSize(16);
      doc.text("Requisition", 105, 30, { align: "center" });

      // Right-aligned info
      doc.setFontSize(12);
      doc.text("Requisition: ASDF1234567", 190, 40, { align: "right" });
      doc.text("Date: 12/3/2025", 190, 48, { align: "right" });

      // Left-aligned info
      doc.text("branch: Head Office", 20, 40);
      doc.text("Topic: Withdraw assets", 20, 48);

      // First line (gray)
      doc.setLineWidth(0.5);
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 55, 190, 55);

      // Table header
      doc.setFontSize(12);
      doc.text("No", 20, 65);
      doc.text("Description", 105, 65, { align: "center" });
      doc.text("Amount", 190, 65, { align: "right" });

      // Second line (black)
      doc.setDrawColor(17, 17, 17);
      doc.line(20, 70, 190, 70);

      // Table data
      let yPosition = 75;
      data.forEach((row, index) => {
        doc.text(`${index + 1}`, 20, yPosition);
        doc.text(row.item, 105, yPosition, { align: "center" });
        doc.text(`${row.quantity}`, 190, yPosition, { align: "right" });
        yPosition += 10;
      });

      // Third line (black)
      doc.line(20, yPosition + 10, 190, yPosition + 10);

      // Footer (right-aligned)
      doc.text("Full Name ...........................................", 190, yPosition + 20, { align: "right" });
      doc.text("Date .............../................./.................", 190, yPosition + 30, { align: "right" });

      doc.save("ใบเบิกสินค้า.pdf");
      console.log("ส่งออก PDF สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งออก PDF:", error);
    }
  };

 
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mb-5 flex gap-3 items-center justify-end m-3">
        <button
          onClick={exportToPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export PDF
        </button>
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
          <p className="text-lg">Requisition</p>
        </header>

        <div className="flex justify-between mb-6">
          <div>
            <p>branch : Head office</p>
            <p>Topic: Withdraw assets</p>
          </div>
          <div className="text-right">
            <p>Requisition: ASDF1234567</p>
            <p>Date: 12/3/2025</p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-300 my-6" />

        <div className="flex justify-between mb-2 font-bold">
          <p className="w-16 text-center">No</p>
          <p className="flex-1 text-center">Description</p>
          <p className="w-16 text-right">Amount</p>
        </div>

        <div className="w-full h-[1px] bg-black my-4" />

        {data.map((row, index) => ( 
          <div key={index} className="flex justify-between mb-2 text-sm">
            <p className="w-16 text-center">{index + 1}</p>
            <p className="flex-1 text-center">{row.item}</p>
            <p className="w-16 text-right">{row.quantity}</p>
          </div>
        ))}

        <div className="w-full h-[1px] bg-black my-6" />

        <div className="flex flex-col items-end text-right gap-3 mt-20">
          <p>Full Name ...........................................</p>
          <p>Date .............../................./.................</p>
        </div>
      </div>
    </div>
  );
}

export default ExportPage;