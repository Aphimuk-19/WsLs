import React, { useContext, useRef, useEffect, useState } from "react";
import { LocationContext } from "../Context/LocationContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Spin, message } from "antd";
import axios from "axios";
import { BASE_URL } from '../config/config'; // Add this import

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.billData) {
      setBillData(location.state.billData);
      console.log("Bill Data from location.state:", location.state.billData);
    } else {
      const storedBillData = localStorage.getItem("billData");
      if (storedBillData) {
        const parsedBillData = JSON.parse(storedBillData);
        setBillData(parsedBillData);
        console.log("Bill Data from localStorage:", parsedBillData);
      } else {
        navigate("/productlocation");
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    console.log("Addproduct rendered with columns:", columns);
    console.log("Addproduct rendered with newCells:", newCells);
  }, [columns, newCells]);

  const fetchProductLocations = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

      const response = await axios.get(`${BASE_URL}/api/cell/cellsAll`, { // Updated URL
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response from fetchProductLocations:", response.data);

      if (!response.data.success) throw new Error("Invalid API response");

      const locations = [];
      response.data.data.forEach((cell) => {
        if (cell.products && cell.products.length > 0) {
          cell.products.forEach((product) => {
            if (product.product?.productId === productId) {
              locations.push(`${cell.col}-${cell.row}`);
            }
          });
        }

        if (cell.subCellsA && cell.subCellsA.products && cell.subCellsA.products.length > 0) {
          cell.subCellsA.products.forEach((product) => {
            if (product.product?.productId === productId) {
              locations.push(`${cell.col}-${cell.row}-A`);
            }
          });
        }

        if (cell.subCellsB && cell.subCellsB.products && cell.subCellsB.products.length > 0) {
          cell.subCellsB.products.forEach((product) => {
            if (product.product?.productId === productId) {
              locations.push(`${cell.col}-${cell.row}-B`);
            }
          });
        }
      });

      console.log("Existing Locations for product", productId, ":", locations);
      setExistingLocations(locations);
    } catch (error) {
      console.error("Error fetching product locations:", error.message);
      if (error.response?.status === 401) {
        message.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        message.error("เกิดข้อผิดพลาดในการดึงตำแหน่งสินค้า");
        setExistingLocations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCellClickWithDropdown = (row, col, subCellId = null) => {
    const cellId = subCellId || `${col}-${row}`;
    handleCellClick(row, col);
    setSelectedCell(cellId);
    setPersistentSelectedCell(cellId);
    console.log("Selected cell/sub-cell in Addproduct:", cellId);
  };

  const getBackgroundColor = (status, isSelected, cellId = null) => {
    if (isSelected) return "bg-blue-500";
    const isSubCell = cellId && (cellId.includes("-A") || cellId.includes("-B"));
    if (isSubCell) {
      switch (status) {
        case 0: return "bg-white";
        case 1: return "bg-[#0A8F08]";
        case 2: return "bg-red-500";
        case 3: return "bg-gray-500";
        default: return "bg-white";
      }
    }
    switch (status) {
      case 0: return "bg-white";
      case 1: return "bg-green-500";
      case 2: return "bg-red-500";
      case 3: return "bg-gray-500";
      default: return "bg-white";
    }
  };

  const getTextColor = (status, isSelected, cellId = null) => {
    if (isSelected) return "text-white";
    const isSubCell = cellId && (cellId.includes("-A") || cellId.includes("-B"));
    if (isSubCell) {
      switch (status) {
        case 0: return "text-black";
        case 1: return "text-white";
        case 2: return "text-white";
        case 3: return "text-white";
        default: return "text-black";
      }
    }
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

  const handleLocationClick = (location) => {
    setPersistentSelectedCell(location);
    setSelectedCell(location);
    console.log("Selected location from existing locations:", location);
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

    const item = billData?.items.find((item) => item.product.productId === selectedProduct);
    if (!item) return;

    setStoredProducts((prev) => ({
      ...prev,
      [selectedProduct]: {
        cellId: persistentSelectedCell,
        storedQuantity: item.quantity,
      },
    }));

    console.log(`Assigned ${selectedProduct} to ${persistentSelectedCell} with quantity ${item.quantity}`);
  };

  const areAllProductsStored = () => {
    if (!billData || !billData.items) return false;

    return billData.items.every((item) => {
      const stored = storedProducts[item.product.productId];
      return stored && stored.storedQuantity === item.quantity;
    });
  };

  const handleConfirm = async () => {
    if (!areAllProductsStored()) {
      message.error("กรุณาจัดเก็บสินค้าให้ครบทุกชิ้นก่อนยืนยัน");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

      const assignments = Object.entries(storedProducts).map(([productId, { cellId, storedQuantity }]) => {
        const item = billData.items.find((item) => item.product.productId === productId);
        const product = item?.product;
        if (!product) return null;

        const isSubCell = cellId.includes("-A") || cellId.includes("-B");
        let subCell = null;
        if (isSubCell) {
          subCell = cellId.endsWith("-A") ? "subCellsA" : "subCellsB";
        }

        return {
          productId: product.productId,
          cellId: isSubCell ? cellId.split("-").slice(0, 2).join("-") : cellId,
          subCell,
        };
      }).filter((item) => item !== null);

      const payload = {
        billNumber: billData.billNumber,
        assignments,
      };

      console.log("Payload sent to backend:", payload);

      const response = await axios.post(
        `${BASE_URL}/api/manage/assign-products-from-bill`, // Updated URL
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Confirm Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to assign products");
      }

      Modal.success({
        title: "สำเร็จ",
        content: "เพิ่มสินค้าลงในคลังเรียบร้อยแล้ว",
        onOk: () => {
          window.close();
          setTimeout(() => navigate("/productlocation"), 100);
        },
      });
    } catch (error) {
      console.error("Failed to confirm products:", error.message);
      if (error.response?.status === 401) {
        message.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        message.error("เกิดข้อผิดพลาดในการยืนยัน: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.close();
    setTimeout(() => navigate("/productlocation"), 100);
  };

  const productsWithQuantity = billData?.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  })) || [];

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Spin spinning={loading} tip="กำลังโหลด...">
        <div className="w-[1050px] bg-white rounded-[7px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
          <div className="p-6 flex justify-between items-center border-b border-[#E1E8F1]">
            <h1 className="text-black text-xl font-bold">จัดการสินค้าในคลัง</h1>
            <p className="text-sm">
              รหัสบิล: <span>{billData?.billNumber || "INV20250306-001"}</span>
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(100vh-150px)] overflow-y-auto px-4">
            <div className="flex flex-col justify-start items-center w-full mt-5">
              <div className="flex justify-center w-full">
                <div className="p-3 w-[983px] h-[100px] relative bg-gray-100 mb-4">
                  <h1 className="text-black text-sm font-semibold mb-4">รายละเอียดบิล</h1>
                  <p className="text-black text-xs mb-2">
                    วันที่: {billData?.created_at ? formatDate(billData.created_at) : "6 มีนาคม 2568"}
                  </p>
                  <p className="text-black text-xs">
                    จำนวนรายการสินค้า: <span>{billData?.items.length || "0"}</span> <span>รายการ</span>
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
                                    : `${getBackgroundColor(status, isSelected, cellId)} border border-gray-200 rounded-sm hover:bg-opacity-75`
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
                                        className={`h-16 flex-1 ${getBackgroundColor(subCellStatus, isSubCellSelected, subCell.id)} ${getTextColor(subCellStatus, isSubCellSelected, subCell.id)} border border-gray-200 rounded-sm flex items-center justify-center hover:bg-opacity-75`}
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
                                  <div className={`flex items-center justify-center h-full w-full ${getTextColor(status, isSelected, cellId)}`}>
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
                      <div className="w-4 h-4 bg-[#0A8F08] border border-gray-200 rounded-full mr-2"></div>
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
                    <p className="text-black text-[13px] font-medium flex flex-wrap items-center">
                      Location:{" "}
                      {existingLocations.length > 0 ? (
                        existingLocations.map((loc, index) => (
                          <span
                            key={index}
                            className={`inline-block mx-1 px-2 py-1 text-sm rounded cursor-pointer transition-colors ${
                              persistentSelectedCell === loc
                                ? "bg-blue-500 text-white"
                                : "bg-blue-100 text-blue-500 hover:bg-blue-200"
                            }`}
                            onClick={() => handleLocationClick(loc)}
                          >
                            {loc}
                          </span>
                        ))
                      ) : (
                        <span className="text-blue-500">ไม่มีตำแหน่ง</span>
                      )}
                    </p>
                    <button
                      className={`w-[68px] h-[25px] rounded-[5px] border mt-5 ${
                        persistentSelectedCell && isButtonEnabled(persistentSelectedCell)
                          ? "bg-[#0a8f08] text-white border-[#0a8f08] hover:bg-[#067d06]"
                          : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleUseCell}
                      disabled={!persistentSelectedCell || !isButtonEnabled(persistentSelectedCell) || loading}
                    >
                      {loading ? <Spin size="small" /> : "ใช้ช่องนี้"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center w-full mt-4 relative">
                <div className="w-[983px] mb-16">
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
                      {productsWithQuantity.map(({ product, quantity }, index) => (
                        <tr
                          key={product.productId || index}
                          className={`border-b border-gray-300 hover:bg-gray-50 cursor-pointer ${
                            selectedProduct === product.productId ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleProductRowClick(product.productId)}
                        >
                          <td className="p-2 text-sm text-center">{product.productId}</td>
                          <td className="p-2 text-sm text-center">{product.name}</td>
                          <td className="p-2 text-sm text-center">{quantity || "N/A"}</td>
                          <td className="p-2 text-sm text-center">
                            {storedProducts[product.productId]?.storedQuantity || 0}
                          </td>
                          <td className="p-2 text-sm text-center relative">
                            {storedProducts[product.productId]?.cellId || "ยังไม่ได้เลือก"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="absolute bottom-0 left-0 w-full flex justify-end p-4 bg-white mt-10">
                  <button
                    className={`w-[80px] h-[35px] rounded-[5px] border ${
                      areAllProductsStored()
                        ? "bg-[#0a8f08] text-white border-[#0a8f08] hover:bg-[#067d06]"
                        : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleConfirm}
                    disabled={!areAllProductsStored() || loading}
                  >
                    {loading ? <Spin size="small" /> : "ตกลง"}
                  </button>
                  <button
                    className="w-[80px] h-[35px] bg-gray-500 text-white rounded-[5px] border border-gray-600 hover:bg-gray-600 ml-4"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Addproduct;