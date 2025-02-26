// src/Page/Managelocation.jsx
import React, { useContext, useRef, useEffect } from "react";
import HeaderManageLocation from "../Custom/HeaderManageLocation";
import { LocationContext } from "../Context/LocationContext";
import { PlusCircleOutlined } from "@ant-design/icons";

const Managelocation = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    capacity,
    setCapacity,
    popupCapacity,
    setPopupCapacity,
    cellCount,
    setCellCount,
    handleAddColumn,
    handleCellClick,
    handleAddCellToEmptySlot,
    handleCellStatusChange,
  } = useContext(LocationContext);

  const tableRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedCell(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setSelectedCell]);

  return (
    <div>
      <HeaderManageLocation />
      <div className="p-4 max-w-6xl mx-auto w-full mt-[50px]">
        <div className="flex flex-col">
          <div className="flex justify-end mb-4 space-x-4">
            <label className="text-sm mr-2"></label>
            <select
              value={cellCount}
              onChange={(e) => setCellCount(Number(e.target.value))}
              className="h-[37px] px-4 py-2 border rounded text-sm"
            >
              <option value={1}>1 เซลล์</option>
              <option value={2}>2 เซลล์</option>
              <option value={3}>3 เซลล์</option>
              <option value={4}>4 เซลล์</option>
            </select>
            <label className="text-sm mr-2"></label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="h-[37px] px-4 py-2 border rounded text-sm"
              min="1"
              max="10"
            />
            <button
              onClick={handleAddColumn}
              className="h-[37px] px-4 py-2 bg-[#006ec4] rounded justify-center items-center gap-[7.92px] inline-flex text-white text-[15px] font-light leading-[19px] hover:bg-[#006ec4] hover:brightness-110 hover:shadow-md"
            >
              <PlusCircleOutlined />
              Add Location
            </button>
          </div>

          <div className="flex overflow-x-auto">
            <div className="flex flex-col justify-between mr-4 pt-1">
              {rows.map((row) => (
                <div
                  key={row}
                  className="h-16 flex items-center text-gray-600 text-sm"
                >
                  {row}
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col" ref={tableRef}>
              <div
                className="grid gap-2 border border-gray-200 rounded-md bg-white p-2"
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                }}
              >
                {rows.map((row) => (
                  <React.Fragment key={row}>
                    {columns.map((col) => {
                      const isCellAvailable = newCells[col]?.find(
                        (cell) => cell.row === row
                      );
                      const cellId = `${row}-${col}`;
                      const isDisabled = cellStatus[cellId] === "disabled";
                      const cellCapacity =
                        newCells[col]?.find((cell) => cell.row === row)
                          ?.capacity || 0;
                      return (
                        <div
                          key={cellId}
                          className={`h-16 w-36 ${
                            isCellAvailable
                              ? isDisabled
                                ? "bg-[#121212]/75 text-white"
                                : "bg-green-500"
                              : "bg-gray-50"
                          } border border-gray-200 rounded-sm hover:bg-gray-100 relative`}
                          onClick={() => handleCellClick(row, col)}
                        >
                          <div className="flex items-center justify-center">
                            {row}-{col}
                          </div>
                          {isCellAvailable &&
                            !isDisabled &&
                            selectedCell === cellId && (
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white opacity-90 z-10">
                                <select
                                  onChange={(e) =>
                                    handleCellStatusChange(
                                      cellId,
                                      e.target.value
                                    )
                                  }
                                  className="p-2 border rounded"
                                  defaultValue=""
                                >
                                  <option value="">เลือกสถานะ</option>
                                  <option value="disabled">ปิดการใช้งาน</option>
                                </select>
                              </div>
                            )}
                          {isCellAvailable && (
                            <div className="absolute bottom-0 left-0 w-full text-center text-xs">
                              Capacity: {cellCapacity}
                            </div>
                          )}
                          {!isCellAvailable && selectedCell === cellId && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white opacity-90 z-10">
                              <div className="flex flex-col items-center">
                                <label className="text-sm mb-2">
                                  กำหนดขนาด Capacity:
                                </label>
                                <input
                                  type="number"
                                  value={popupCapacity}
                                  onChange={(e) =>
                                    setPopupCapacity(Number(e.target.value))
                                  }
                                  className="px-4 py-2 border rounded mb-2"
                                  min="1"
                                  max="10"
                                />
                                <button
                                  onClick={handleAddCellToEmptySlot}
                                  className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                  เพิ่ม
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex mt-2 px-2">
                {columns.map((col) => (
                  <div
                    key={col}
                    className="flex-1 text-center text-gray-600 text-sm"
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
        </div>
      </div>
    </div>
  );
};

export default Managelocation;
