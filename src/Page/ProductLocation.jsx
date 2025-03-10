import React, { useContext, useRef, useEffect, useState } from "react";
import { LocationContext } from "../Context/LocationContext";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // เพิ่มการนำทาง

const data = [
  {
    key: "1",
    no: "1",
    id: "#876364",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20240409150821_66703_287_1.jpg?v=667031724752095",
    location: "A-04",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 20,
  },
];

const productListData = [
  { no: "1", code: "1001", type: "NB", name: "ASUS VIVOBOOK", quantity: 10 },
  { no: "2", code: "1002", type: "NB", name: "ASUS VIVOBOOK", quantity: 5 },
  { no: "3", code: "1003", type: "NB", name: "ASUS VIVOBOOK", quantity: 15 },
  { no: "4", code: "1004", type: "NB", name: "ASUS VIVOBOOK", quantity: 8 },
];

const ProductLocation = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    handleCellClick,
    handleCellStatusChange,
  } = useContext(LocationContext);

  const navigate = useNavigate(); // เพิ่มตัวนำทาง
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductListModalOpen, setIsProductListModalOpen] = useState(false);
  const [isProductManageModalOpen, setIsProductManageModalOpen] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(""); // เพิ่ม state สำหรับข้อผิดพลาด

  const baseColumnWidth = 9;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${columns.length * baseColumnWidth + (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) + paddingWidth}rem`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedCell(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSelectedCell]);

  const handleButtonClick = () => setIsModalOpen(true);

  const handleSubmit = () => {
    // ตรวจสอบเงื่อนไข: ต้องมี 8 ตัวอักษร
    if (billNumber.length !== 8) {
      setError("เลขที่บิลสินค้าต้องมี 8 ตัวอักษร");
      return;
    }

    setError(""); // ล้างข้อผิดพลาดถ้าผ่านเงื่อนไข
    console.log("Bill Number:", billNumber);
    setBillNumber("");
    setIsModalOpen(false);
    
    navigate("/Addproduct", { state: { billNumber } });
  };

  const handleCancel = () => {
    setBillNumber("");
    setError(""); // ล้างข้อผิดพลาดเมื่อยกเลิก
    setIsModalOpen(false);
  };

  const handleProductListCancel = () => setIsProductListModalOpen(false);
  const handleProductListNext = () => {
    setIsProductListModalOpen(false);
    setIsProductManageModalOpen(true);
  };
  const handleProductManageCancel = () => {
    setIsProductManageModalOpen(false);
    setSelectedOption("");
  };
  const handleOptionChange = (e) => setSelectedOption(e.target.value);

  return (
    <div className="p-4 max-w-6xl mx-auto w-full mt-[30px]">
      <div className="mb-6 flex items-center justify-end">
        <button
          className="w-[142px] h-[37px] p-[15.83px] bg-[#006ec4] rounded-lg justify-center items-center gap-[7.92px] inline-flex text-white text-[15px] font-light leading-[19px] hover:bg-[#006ec4] hover:brightness-110 hover:shadow-md"
          onClick={handleButtonClick}
        >
          <PlusCircleOutlined />
          In Bound
        </button>
      </div>

      {/* Modal กรอกเลขที่บิล */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[450px]">
            <h2 className="text-xl font-bold mb-6 text-gray-800">กรุณาใส่เลขที่บิลสินค้า</h2>
            <input
              type="text"
              value={billNumber}
              onChange={(e) => {
                setBillNumber(e.target.value);
                setError(""); // ล้างข้อผิดพลาดเมื่อพิมพ์
              }}
              className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#006ec4] transition-all`}
              placeholder="เลขที่บิลสินค้า"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#006ec4] text-white rounded-lg hover:bg-[#006ec4] hover:brightness-110 font-medium transition-all"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex overflow-x-auto">
        <div className="flex flex-col justify-between mr-4 pt-1">
          {rows.map((row) => (
            <div key={row} className="h-16 flex items-center text-gray-600 text-sm">{row}</div>
          ))}
        </div>

        <div className="flex-1 flex flex-col" ref={tableRef}>
          <div
            className="grid gap-2 border border-gray-200 rounded-md bg-white p-2 box-border"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, ${columnWidth})`,
              width: totalWidth,
            }}
          >
            {rows.map((row) => (
              <React.Fragment key={row}>
                {columns.map((col) => {
                  const cellId = `${col}-${row}`;
                  const cell = newCells[col]?.find((c) => c.row === row);
                  const isDisabled = cellStatus[cellId] === "disabled";
                  const hasSubCells = cell?.subCells?.length > 0;

                  return (
                    <div
                      key={cellId}
                      className={`h-16 ${
                        hasSubCells
                          ? "flex space-x-2 bg-transparent"
                          : `${cell ? (isDisabled ? "bg-[#121212]/75 text-white" : "bg-green-500") : "bg-gray-50"} border border-gray-200 rounded-sm hover:bg-gray-100`
                      } relative`}
                      onClick={() => handleCellClick(row, col)}
                    >
                      {hasSubCells ? (
                        cell.subCells.map((subCell) => (
                          <div
                            key={subCell.id}
                            className={`h-16 flex-1 ${isDisabled ? "bg-[#121212]/75 text-white" : "bg-green-500"} border border-gray-200 rounded-sm flex items-center justify-center relative`}
                            style={{ width: `${baseColumnWidth / 2 - 0.5}rem` }}
                          >
                            <div>{subCell.id}</div>
                            <div className="absolute bottom-0 left-0 w-full text-center text-xs">
                              Capacity: {subCell.capacity}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-center justify-center h-full w-full">{col}-{row}</div>
                          {cell && (
                            <div className="absolute bottom-0 left-0 w-full text-center text-xs">
                              Capacity: {cell.capacity}
                            </div>
                          )}
                          {cell && !isDisabled && selectedCell === cellId && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white opacity-90 z-10">
                              <select
                                onChange={(e) => handleCellStatusChange(cellId, e.target.value)}
                                className="p-2 border rounded"
                                defaultValue=""
                              >
                                <option value="">เลือกสถานะ</option>
                                <option value="disabled">ปิดการใช้งาน</option>
                              </select>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="flex mt-2 px-2 gap-2" style={{ width: totalWidth }}>
            {columns.map((col) => (
              <div
                key={col}
                className="flex items-center justify-center text-gray-600 text-sm"
                style={{ width: columnWidth, minWidth: columnWidth }}
              >
                {col}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start mt-10 space-x-20 ml-[37px]">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#0A8F08] border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">พื้นที่ว่าง</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#F2383A] border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">พื้นที่ไม่ว่าง</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#121212]/75 border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">ปิดการใช้งาน</span>
        </div>
      </div>

      <div className="h-[325px] bg-white border border-black/50 mt-7 mx-auto py-4 px-6">
        <div className="flex items-center">
          <p className="opacity-70 text-black text-lg font-bold">สินค้าใน</p>
          <input
            className="w-[65px] h-[25px] bg-[#d9d9d9]/50 border border-black ml-2"
            type="text"
          />
        </div>
        <div className="px-4 p-4 w-full h-[60px] mb-4">
          <div className="flex gap-6">
            <p className="w-[100px] flex items-center justify-center text-center">No</p>
            <p className="w-[150px] flex items-center justify-center text-center">ID</p>
            <p className="w-[120px] flex items-center justify-center text-center">Type</p>
            <p className="w-[200px] flex items-center justify-center text-center">Name</p>
            <p className="w-[130px] flex items-center justify-center text-center">Location</p>
            <p className="w-[120px] flex items-center justify-center text-center">In</p>
            <p className="w-[120px] flex items-center justify-center text-center">End</p>
            <p className="w-[150px] flex items-center justify-center text-center">Status</p>
          </div>
        </div>
        {data.map((item) => (
          <div
            key={item.key}
            className="px-4 p-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
          >
            <div className="flex gap-6">
              <div className="w-[100px] flex items-center justify-center text-center">{item.no}</div>
              <div className="w-[150px] flex items-center justify-center text-center">{item.id}</div>
              <div className="w-[120px] flex items-center justify-center text-center">{item.type}</div>
              <div className="w-[200px] flex items-center justify-center text-center">
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full mr-2" />
                {item.name}
              </div>
              <div className="w-[130px] flex items-center justify-center text-center">{item.location}</div>
              <div className="w-[120px] flex items-center justify-center text-center">{item.in}</div>
              <div className="w-[120px] flex items-center justify-center text-center">{item.end}</div>
              <div className="w-[150px] flex items-center justify-center text-center">Succes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductLocation;