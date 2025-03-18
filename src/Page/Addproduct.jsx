import React, { useContext, useRef, useEffect, useState } from "react";
import { LocationContext } from "../Context/LocationContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "antd";

const Addproduct = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    handleCellClick,
  } = useContext(LocationContext);

  const location = useLocation();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [persistentSelectedCell, setPersistentSelectedCell] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [billData, setBillData] = useState(null);
  const [storedProducts, setStoredProducts] = useState({});
  const [existingLocations, setExistingLocations] = useState([]);

  useEffect(() => {
    if (location.state && location.state.billData) {
      setBillData(location.state.billData);
    }
  }, [location.state]);

  useEffect(() => {
    console.log("Addproduct rendered with columns:", columns);
    console.log("Addproduct rendered with newCells:", newCells);
  }, [columns, newCells]);

  const fetchProductLocations = async (productId) => {
    try {
      const response = await fetch("http://172.18.43.37:3000/api/cell/products");
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      if (!data.success || !Array.isArray(data.data)) throw new Error("Invalid API response");

      const matchingProducts = data.data.filter((product) => product.productId === productId);
      const locations = matchingProducts.map((product) => {
        const cellId = product.location.cellId;
        const subCell = product.location.subCell;
        return subCell ? `${cellId}-${subCell}` : cellId;
      });

      setExistingLocations(locations);
    } catch (error) {
      console.error("Error fetching product locations:", error.message);
      setExistingLocations([]);
    }
  };

  const handleCellClickWithDropdown = (row, col, subCellId = null) => {
    const cellId = subCellId || `${col}-${row}`;
    handleCellClick(row, col);
    setSelectedCell(cellId);
    setPersistentSelectedCell(cellId);
    console.log("Selected cell/sub-cell in Addproduct:", cellId);
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

  const getStatusMessage = (cellId) => {
    const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
    switch (status) {
      case 0: return { text: "ไม่พร้อมใช้งาน", color: "text-black" };
      case 1: return { text: "พร้อมใช้งาน", color: "text-[#0a8f08]" };
      case 2: return { text: "เต็ม", color: "text-red-500" };
      case 3: return { text: "ปิดใช้งาน", color: "text-gray-500" };
      default: return { text: "ไม่พร้อมใช้งาน", color: "text-black" };
    }
  };

  const isButtonEnabled = (cellId) => {
    const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
    return status === 1 && selectedProduct !== null;
  };

  const baseColumnWidth = 9;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${
    columns.length * baseColumnWidth +
    (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) +
    paddingWidth
  }rem`;

  const handleProductRowClick = (productId) => {
    setSelectedProduct(productId);
    fetchProductLocations(productId);
    console.log("Selected product:", productId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("th-TH", { month: "long" });
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const handleUseCell = () => {
    if (!persistentSelectedCell || !selectedProduct) return;

    const product = billData.items.find((item) => item.product.productId === selectedProduct)?.product;
    if (!product) return;

    setStoredProducts((prev) => ({
      ...prev,
      [selectedProduct]: {
        cellId: persistentSelectedCell,
        storedQuantity: product.quantity, // Store full quantity by default
      },
    }));

    console.log(`Assigned ${selectedProduct} to ${persistentSelectedCell}`);
  };

  // Check if all products are fully stored
  const areAllProductsStored = () => {
    if (!billData || !billData.items) return false;

    const allProducts = billData.items.map((item) => ({
      productId: item.product.productId,
      quantity: item.product.quantity,
    }));

    return allProducts.every((product) => {
      const stored = storedProducts[product.productId];
      return stored && stored.storedQuantity === product.quantity;
    });
  };

  const handleConfirm = async () => {
    if (!areAllProductsStored()) {
      alert("กรุณาจัดเก็บสินค้าให้ครบทุกชิ้นก่อนยืนยัน");
      return;
    }

    try {
      for (const [productId, { cellId, storedQuantity }] of Object.entries(storedProducts)) {
        const product = billData.items.find((item) => item.product.productId === productId)?.product;
        const isSubCell = cellId.includes("-A") || cellId.includes("-B");
        const subCell = isSubCell ? (cellId.endsWith("-A") ? "A" : "B") : null;

        const payload = {
          productId: product.productId,
          type: product.type,
          name: product.name,
          inDate: billData.inDate,
          endDate: billData.endDate || new Date().toISOString(),
          quantity: storedQuantity,
          image: product.image,
          location: {
            cellId: isSubCell ? cellId.split("-").slice(0, 2).join("-") : cellId,
            subCell,
          },
        };

        const response = await fetch("http://172.18.43.37:3000/api/cell/add-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add product: ${errorText}`);
        }
      }

      Modal.success({
        title: "สำเร็จ",
        content: "เพิ่มสินค้าลงในคลังเรียบร้อยแล้ว",
        onOk: () => {
          navigate("/productlocation");
        },
      });
    } catch (error) {
      console.error("Failed to confirm products:", error.message);
      alert("เกิดข้อผิดพลาดในการยืนยัน: " + error.message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const products = billData?.items.map((item) => item.product) || [];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[1050px] max-h-[110vh] relative bg-white rounded-[7px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="p-6 flex justify-between items-center border-b border-[#E1E8F1]">
          <h1 className="text-black text-xl font-bold">จัดการสินค้าในคลัง</h1>
          <p className="text-sm">
            รหัสบิล: <span>{billData?.billNumber || "INV20250306-001"}</span>
          </p>
        </div>
        <div className="flex flex-col justify-start items-center w-full mt-5 px-4">
          <div className="flex justify-center w-full">
            <div className="p-3 w-[983px] h-[100px] relative bg-gray-100 mb-4">
              <h1 className="text-black text-sm font-semibold mb-4">รายละเอียดบิล</h1>
              <p className="text-black text-xs mb-2">
                วันที่: {billData?.inDate ? formatDate(billData.inDate) : "6 มีนาคม 2568"}
              </p>
              <p className="text-black text-xs">
                จำนวนรายการสินค้า: <span>{billData?.uniqueProductCount || "0"}</span> <span>รายการ</span>
              </p>
            </div>
          </div>
          <div className="flex justify-center w-full mt-3">
            <div className="w-[983px]">
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
                    style={{ gridTemplateColumns: `repeat(${columns.length}, ${columnWidth})`, width: totalWidth }}
                  >
                    {[...rows].reverse().map((row) =>
                      columns.map((col) => {
                        const cellId = `${col}-${row}`;
                        const cell = newCells[col]?.find((c) => c.row === row);
                        const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
                        const hasSubCells = cell?.subCells?.length > 0;
                        const isSelected = persistentSelectedCell === cellId;

                        if (!cell) {
                          return (
                            <div
                              key={cellId}
                              className="h-16"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCellClickWithDropdown(row, col);
                              }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasSubCells) handleCellClickWithDropdown(row, col);
                            }}
                          >
                            {hasSubCells ? (
                              cell.subCells.map((subCell) => {
                                const subCellStatus = cellStatus[subCell.id] !== undefined ? cellStatus[subCell.id] : 0;
                                const isSubCellSelected = persistentSelectedCell === subCell.id;
                                return (
                                  <div
                                    key={subCell.id}
                                    className={`h-16 flex-1 ${getBackgroundColor(subCellStatus, isSubCellSelected)} ${getTextColor(subCellStatus, isSubCellSelected)} border border-gray-200 rounded-sm flex items-center justify-center hover:bg-opacity-75`}
                                    style={{ width: `${baseColumnWidth / 2}rem` }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCellClickWithDropdown(row, col, subCell.id);
                                    }}
                                  >
                                    <div className="text-xs">{subCell.id}</div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className={`flex items-center justify-center h-full w-full ${getTextColor(status, isSelected)}`}>
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
                  <span className="text-sm">0 (ว่าง)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 border border-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm">1 (ใช้งาน)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 border border-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm">2 (เต็ม)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 border border-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm">3 (ปิดการใช้งาน)</span>
                </div>
              </div>
              <div className="w-[983px] h-[149px] relative bg-gray-100 p-4 mt-4">
                <h1 className="text-black text-base font-semibold">
                  ข้อมูลจัดเก็บ: <span>{persistentSelectedCell || "ยังไม่ได้เลือก"}</span>
                </h1>
                <p className="text-black text-[13px] font-medium">
                  สถานะ:{" "}
                  <span className={persistentSelectedCell ? getStatusMessage(persistentSelectedCell).color : "text-black"}>
                    {persistentSelectedCell ? getStatusMessage(persistentSelectedCell).text : "ยังไม่ได้เลือก"}
                  </span>
                </p>
                <p className="text-black text-[13px] font-medium">
                  Location: <span className="text-blue-500">{existingLocations.length > 0 ? existingLocations.join(", ") : "ไม่มีตำแหน่ง"}</span>
                </p>
                <button
                  className={`w-[68px] h-[25px] rounded-[5px] border mt-5 ${
                    persistentSelectedCell && isButtonEnabled(persistentSelectedCell)
                      ? "bg-[#0a8f08] text-white border-[#0a8f08] hover:bg-[#067d06]"
                      : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleUseCell}
                  disabled={!persistentSelectedCell || !isButtonEnabled(persistentSelectedCell)}
                >
                  ใช้ช่องนี้
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mt-4">
            <div className="w-[983px] mb-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="p-2 text-sm text-center">รหัสสินค้า</th>
                    <th className="p-2 text-sm text-center">ชื่อสินค้า</th>
                    <th className="p-2 text-sm text-center">จำนวนสินค้า</th>
                    <th className="p-2 text-sm text-center">จัดเก็บแล้ว</th>
                    <th className="p-2 text-sm text-center">ช่องจัดเก็บ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.productId}
                      className={`border-b border-gray-300 hover:bg-gray-50 cursor-pointer ${
                        selectedProduct === product.productId ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleProductRowClick(product.productId)}
                    >
                      <td className="p-2 text-sm text-center">{product.productId}</td>
                      <td className="p-2 text-sm text-center">{product.name}</td>
                      <td className="p-2 text-sm text-center">{product.quantity}</td>
                      <td className="p-2 text-sm text-center">
                        {storedProducts[product.productId]?.storedQuantity || 0}
                      </td>
                      <td className="p-2 text-sm text-center relative">
                        {storedProducts[product.productId]?.cellId || "ยังไม่ได้เลือก"}
                        {selectedProduct === product.productId && !storedProducts[product.productId] && (
                          <span className="absolute right-2 text-xs text-blue-500">กำลังเลือก</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end pl-4 mt-4 p-10">
            <button
              className={`w-[80px] h-[35px] rounded-[5px] border ${
                areAllProductsStored()
                  ? "bg-[#0a8f08] text-white border-[#0a8f08] hover:bg-[#067d06]"
                  : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
              }`}
              onClick={handleConfirm}
              disabled={!areAllProductsStored()}
            >
              ตกลง
            </button>
            <button
              className="w-[80px] h-[35px] bg-gray-500 text-white rounded-[5px] border border-gray-600 hover:bg-gray-600 ml-4"
              onClick={handleCancel}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addproduct;