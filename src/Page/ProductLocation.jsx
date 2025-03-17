import React, { useContext, useRef, useEffect, useState } from "react";
import { LocationContext } from "../Context/LocationContext";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductLocation = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    handleCellClick,
  } = useContext(LocationContext);

  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsData, setProductsData] = useState([]); // เปลี่ยนจาก billsData เป็น productsData เพื่อให้ชัดเจนว่าเป็นข้อมูลสินค้า

  const baseColumnWidth = 9;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${
    columns.length * baseColumnWidth +
    (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) +
    paddingWidth
  }rem`;

  // ดึงข้อมูลบิลทั้งหมดจาก API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://172.18.43.37 sleeve3000/api/bill/bills/");
        // สมมติว่า API ส่งข้อมูลเป็น array ของบิลที่มี products
        const allProducts = response.data.flatMap((bill) =>
          bill.items.map((item, index) => ({
            key: `${bill.billNumber}-${item.product.productId}`,
            no: index + 1,
            id: item.product.productId,
            type: item.product.type,
            name: item.product.name,
            image: item.product.image,
            location: item.product.location || "N/A",
            in: item.product.inDate,
            end: item.product.endDate,
            quantity: item.product.quantity,
          }))
        );
        setProductsData(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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

  const handleSubmit = async () => {
    if (billNumber.length !== 8) {
      setError("เลขที่บิลสินค้าต้องมี 8 ตัวอักษร");
      return;
    }

    try {
      const response = await axios.get(`http://172.18.43.37:3000/api/bill/bills/${billNumber}`);
      const billData = response.data.bill; // สมมติว่า API ส่งข้อมูลใน key "bill"
      if (!billData) {
        setError("ไม่พบเลขที่บิลนี้ในระบบ");
        return;
      }

      setError("");
      setIsModalOpen(false);
      navigate("/Addproduct", { state: { billData } });
      setBillNumber("");
    } catch (error) {
      setError("ไม่พบเลขที่บิลนี้ในระบบหรือเกิดข้อผิดพลาด");
      console.error("Error validating bill number:", error);
    }
  };

  const handleCancel = () => {
    setBillNumber("");
    setError("");
    setIsModalOpen(false);
  };

  const handleSearchClick = (product) => {
    setSelectedProduct(product);
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
    setSelectedProduct(null);
  };

  const getBackgroundColor = (status, isSelected) => {
    if (isSelected) return "bg-blue-500";
    switch (status) {
      case 0: return "bg-white";
      case 1: return "bg-green-500";
      case 2: return "bg-red-500";
      case 3: return "bg-gray-500";
      default: return "bg-white";
    }
  };

  const getTextColor = (status, isSelected) => {
    if (isSelected) return "text-white";
    switch (status) {
      case 0: return "text-black";
      case 1: return "text-white";
      case 2: return "text-white";
      case 3: return "text-white";
      default: return "text-black";
    }
  };

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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[450px]">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              กรุณาใส่เลขที่บิลสินค้า
            </h2>
            <input
              type="text"
              value={billNumber}
              onChange={(e) => {
                setBillNumber(e.target.value);
                setError("");
              }}
              className={`w-full p-3 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#006ec4] transition-all`}
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

      <div className="flex overflow-x-auto">
        <div className="flex flex-col justify-between mr-4 pt-1 shrink-0">
          {[...rows].reverse().map((row) => (
            <div key={row} className="h-16 flex items-center text-gray-600 text-sm">
              {row}
            </div>
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
            {[...rows].reverse().map((row) =>
              columns.map((col) => {
                const cellId = `${col}-${row}`;
                const cell = newCells[col]?.find((c) => c.row === row);
                const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
                const hasSubCells = cell?.subCells?.length > 0;
                const isSelected = selectedCell === cellId;

                if (!cell) {
                  return (
                    <div
                      key={cellId}
                      className="h-16"
                      onClick={() => handleCellClick(row, col)}
                    />
                  );
                }

                return (
                  <div
                    key={cellId}
                    className={`h-16 relative ${
                      hasSubCells
                        ? "flex space-x-1 bg-transparent"
                        : `${getBackgroundColor(status, isSelected)} border border-gray-200 rounded-sm hover:bg-opacity-75`
                    }`}
                    onClick={() => {
                      handleCellClick(row, col);
                      setSelectedCell(cellId);
                    }}
                  >
                    {hasSubCells ? (
                      cell.subCells.map((subCell) => {
                        const subCellStatus =
                          cellStatus[subCell.id] !== undefined ? cellStatus[subCell.id] : 0;
                        const isSubCellSelected = selectedCell === subCell.id;
                        return (
                          <div
                            key={subCell.id}
                            className={`h-16 flex-1 ${getBackgroundColor(
                              subCellStatus,
                              isSubCellSelected
                            )} ${getTextColor(
                              subCellStatus,
                              isSubCellSelected
                            )} border border-gray-200 rounded-sm flex items-center justify-center hover:bg-opacity-75`}
                            style={{ width: `${baseColumnWidth / 2}rem` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCellClick(row, col);
                              setSelectedCell(subCell.id);
                            }}
                          >
                            <div className="text-xs">{subCell.id}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className={`flex items-center justify-center h-full w-full ${getTextColor(
                          status,
                          isSelected
                        )}`}
                      >
                        {col}-{row}
                      </div>
                    )}
                  </div>
                );
              })
            )}
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
          <div className="w-4 h-4 bg-white border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(ว่าง)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(ใช้งาน)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(เต็ม)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(ปิดการใช้งาน)</span>
        </div>
      </div>

      <div className="h-[325px] bg-white border border-black/50 mt-7 mx-auto py-4 px-6 overflow-y-auto">
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
            <p className="w-[150px] flex items-center justify-center text-center"></p>
          </div>
        </div>
        {productsData.length > 0 ? (
          productsData.map((item) => (
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
                <div
                  className="w-[150px] flex items-center justify-center text-center cursor-pointer hover:text-blue-500"
                  onClick={() => handleSearchClick(item)}
                >
                  <SearchOutlined className="text-xl" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">ไม่มีข้อมูลสินค้า</div>
        )}
      </div>

      {isSearchModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[450px] max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-[150px] h-[150px] object-contain"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-semibold">Name: {selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">Type: {selectedProduct.type}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Location ที่ตั้งสินค้า:</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{selectedProduct.location}</span>
                    <span className="text-green-600">จำนวน {selectedProduct.quantity} ชิ้น</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSearchModalClose}
                  className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLocation;