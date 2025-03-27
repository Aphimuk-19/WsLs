import React, { useContext, useRef, useEffect, useState } from "react";
import { LocationContext } from "../Context/LocationContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import axios from "axios";

const TransferProduct = () => {
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
  const [targetCell, setTargetCell] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [billData, setBillData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [storedProducts, setStoredProducts] = useState({});
  const [existingLocations, setExistingLocations] = useState([]);

  useEffect(() => {
    if (location.state) {
      if (location.state.billData) {
        setBillData(location.state.billData);
        console.log("Bill Data:", location.state.billData);
      }
      if (location.state.selectedItems) {
        setSelectedItems(location.state.selectedItems);
        console.log("Selected Items:", location.state.selectedItems);
      }
    }
  }, [location.state]);

  useEffect(() => {
    console.log("cellStatus:", cellStatus);
    console.log("TransferProduct rendered with columns:", columns);
    console.log("TransferProduct rendered with newCells:", newCells);
  }, [columns, newCells, cellStatus]);

  const fetchProductLocations = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://172.18.43.37:3000/api/cell/cellsAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

        if (cell.subCellsknightA && cell.subCellsA.products && cell.subCellsA.products.length > 0) {
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

      setExistingLocations(locations);
    } catch (error) {
      console.error("Error fetching product locations:", error.message);
      setExistingLocations([]);
    }
  };

  const handleCellClickWithDropdown = (row, col, subCellId = null) => {
    const cellId = subCellId || `${col}-${row}`;
    const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;

    if (status !== 1) {
      alert(`ไม่สามารถเลือกช่อง ${cellId} ได้: ช่องนี้ไม่พร้อมใช้งาน`);
      setTargetCell(null);
      setSelectedCell(null);
      return;
    }

    handleCellClick(row, col);
    setSelectedCell(cellId);
    setTargetCell(cellId);
    console.log("Selected target cell:", cellId, "with status:", status);
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
      case 0: return { text: "ว่าง", color: "text-black" };
      case 1: return { text: "พร้อมใช้งาน", color: "text-[#0a8f08]" };
      case 2: return { text: "เต็ม", color: "text-red-500" };
      case 3: return { text: "ปิดใช้งาน", color: "text-gray-500" };
      default: return { text: "ไม่พร้อมใช้งาน", color: "text-black" };
    }
  };

  const isButtonEnabled = (cellId) => {
    const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
    return status === 1 && selectedRowKey !== null;
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

  const handleProductRowClick = (rowKey, productId) => {
    if (selectedRowKey === rowKey) {
      setSelectedRowKey(null);
      setExistingLocations([]);
    } else {
      setSelectedRowKey(rowKey);
      fetchProductLocations(productId);
      console.log("Selected row key:", rowKey, "with productId:", productId);
    }
  };

  const handleUseCell = () => {
    if (!targetCell || !selectedRowKey) return;

    const item = selectedItems.find((item, index) => `${item.id}-${index}` === selectedRowKey);
    if (!item || !item.location) {
      alert("ไม่สามารถจัดเก็บได้: ข้อมูลต้นทาง (location) ของสินค้าหายไป");
      return;
    }

    setStoredProducts((prev) => ({
      ...prev,
      [selectedRowKey]: {
        sourceCellId: item.location,
        targetCellId: targetCell,
        storedQuantity: item.requestedQuantity,
      },
    }));

    console.log(`Assigned row ${selectedRowKey} from ${item.location} to ${targetCell} with quantity ${item.requestedQuantity}`);

    setSelectedRowKey(null);
    setTargetCell(null);
    setExistingLocations([]);
  };

  const areAllProductsStored = () => {
    if (!selectedItems || selectedItems.length === 0) return false;

    return selectedItems.every((item, index) => {
      const rowKey = `${item.id}-${index}`;
      const stored = storedProducts[rowKey];
      return stored && stored.storedQuantity === item.requestedQuantity;
    });
  };

  const handleConfirm = async () => {
    if (!areAllProductsStored()) {
      alert("กรุณาจัดเก็บสินค้าให้ครบทุกชิ้นก่อนยืนยัน");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("role");

      if (!token) {
        alert("กรุณาล็อกอินก่อนดำเนินการ");
        navigate("/login");
        return;
      }

      // ตรวจสอบว่าเป็น admin หรือไม่ (ตามที่ backend ต้องการ)
      if (userRole !== "admin") {
        alert("คุณไม่มีสิทธิ์ในการย้ายสินค้า ต้องเป็นผู้ดูแลระบบเท่านั้น");
        navigate("/Dashboard"); // หรือหน้าที่เหมาะสม
        return;
      }

      const moves = Object.entries(storedProducts).map(async ([rowKey, { sourceCellId, targetCellId, storedQuantity }]) => {
        const itemIndex = parseInt(rowKey.split('-').pop(), 10);
        const item = selectedItems[itemIndex];
        if (!item || !sourceCellId || !targetCellId || !item.id || !storedQuantity) {
          console.error(`Missing data for row ${rowKey}:`, { sourceCellId, targetCellId, storedQuantity });
          return null;
        }

        const targetCellStatus = cellStatus[targetCellId] !== undefined ? cellStatus[targetCellId] : 0;
        if (targetCellStatus !== 1) {
          throw new Error(`Target cell ${targetCellId} is not available (status: ${targetCellStatus})`);
        }

        return {
          sourceCellId,
          targetCellId,
          productId: item.id,
          quantity: storedQuantity,
        };
      });

      const resolvedMoves = await Promise.all(moves);
      const validMoves = resolvedMoves.filter(item => item !== null);

      if (validMoves.length === 0) {
        alert("ไม่มีข้อมูลการย้ายสินค้าที่ถูกต้อง");
        return;
      }

      const payload = { moves: validMoves };
      console.log("Payload sent to backend:", payload);

      const response = await axios.post(
        "http://172.18.43.37:3000/api/manage/move-product",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to move products");
      }

      Modal.success({
        title: "สำเร็จ",
        content: "ย้ายสินค้าเรียบร้อยแล้ว",
        onOk: () => {
          navigate("/productlocation");
        },
      });
    } catch (error) {
      console.error("Failed to move products:", error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        alert("เซสชันหมดอายุหรือคุณไม่มีสิทธิ์ กรุณาล็อกอินใหม่");
        navigate("/login");
      } else {
        alert("เกิดข้อผิดพลาดในการย้ายสินค้า: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const productsWithQuantity = selectedItems.length > 0 ? selectedItems : [];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[1050px] max-h-[110vh] relative bg-white rounded-[7px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="p-6 flex justify-between items-center border-b border-[#E1E8F1]">
          <h1 className="text-black text-xl font-bold">จัดการการย้ายสินค้า</h1>
        </div>
        <div className="flex flex-col justify-start items-center w-full mt-5 px-4">
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
                        const isTargetSelected = targetCell === cellId;

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
                                : `${getBackgroundColor(status, isTargetSelected)} border border-gray-200 rounded-sm hover:bg-opacity-75`
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasSubCells) handleCellClickWithDropdown(row, col);
                            }}
                          >
                            {hasSubCells ? (
                              cell.subCells.map((subCell) => {
                                const subCellStatus = cellStatus[subCell.id] !== undefined ? cellStatus[subCell.id] : 0;
                                const isSubCellTargetSelected = targetCell === subCell.id;
                                return (
                                  <div
                                    key={subCell.id}
                                    className={`h-16 flex-1 ${getBackgroundColor(subCellStatus, isSubCellTargetSelected)} ${getTextColor(subCellStatus, isSubCellTargetSelected)} border border-gray-200 rounded-sm flex items-center justify-center hover:bg-opacity-75`}
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
                              <div className={`flex items-center justify-center h-full w-full ${getTextColor(status, isTargetSelected)}`}>
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
                  ข้อมูลจัดเก็บ
                </h1>
                <p className="text-black text-[13px] font-medium">
                  ปลายทาง: <span>{targetCell || "ยังไม่ได้เลือก"}</span> - 
                  สถานะ : <span className={targetCell ? getStatusMessage(targetCell).color : "text-black"}>
                    {targetCell ? getStatusMessage(targetCell).text : "ยังไม่ได้เลือก"}
                  </span>
                </p>
                <p className="text-black text-[13px] font-medium flex flex-wrap items-center">
                  Location : {" "}
                  {existingLocations.length > 0 ? (
                    existingLocations.map((loc, index) => (
                      <span
                        key={index}
                        className="inline-block mx-1 px-2 py-1 text-sm rounded bg-blue-100 text-blue-500"
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
                    targetCell && isButtonEnabled(targetCell)
                      ? "bg-[#0a8f08] text-white border-[#0a8f08] hover:bg-[#067d06]"
                      : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleUseCell}
                  disabled={!targetCell || !isButtonEnabled(targetCell)}
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
                    <th className="p-2 text-sm text-center">จำนวนที่เลือก</th>
                    <th className="p-2 text-sm text-center">จัดเก็บแล้ว</th>
                    <th className="p-2 text-sm text-center">ช่องต้นทาง</th>
                    <th className="p-2 text-sm text-center">ช่องปลายทาง</th>
                  </tr>
                </thead>
                <tbody>
                  {productsWithQuantity.length > 0 ? (
                    productsWithQuantity.map((item, index) => {
                      const rowKey = `${item.id}-${index}`;
                      return (
                        <tr
                          key={rowKey}
                          className={`border-b border-gray-300 hover:bg-gray-50 cursor-pointer ${
                            selectedRowKey === rowKey ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleProductRowClick(rowKey, item.id)}
                        >
                          <td className="p-2 text-sm text-center">{item.id}</td>
                          <td className="p-2 text-sm text-center">{item.name}</td>
                          <td className="p-2 text-sm text-center">{item.requestedQuantity || "N/A"}</td>
                          <td className="p-2 text-sm text-center">
                            {storedProducts[rowKey]?.storedQuantity || 0}
                          </td>
                          <td className="p-2 text-sm text-center">{item.location || "N/A"}</td>
                          <td className="p-2 text-sm text-center relative">
                            {storedProducts[rowKey]?.targetCellId || "ยังไม่ได้เลือก"}
                            {selectedRowKey === rowKey && !storedProducts[rowKey] && (
                              <span className="absolute right-2 text-xs text-blue-500">กำลังเลือก</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-2 text-sm text-center text-gray-500">
                        ยังไม่มีสินค้าที่เลือก
                      </td>
                    </tr>
                  )}
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

export default TransferProduct;