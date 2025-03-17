import React, { useContext, useRef, useEffect, useState } from "react";
import HeaderManageLocation from "../Custom/HeaderManageLocation";
import { LocationContext } from "../Context/LocationContext";
import { Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const Managelocation = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    handleCellClick,
    handleCellStatusChange,
    handleSplitCell,
    handleAddSingleCell,
    handleAddCell,
    isChoosingToSplit,
    setIsChoosingToSplit,
  } = useContext(LocationContext);

  const tableRef = useRef(null);
  const [dropdownCell, setDropdownCell] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsAdmin(userRole?.toLowerCase() === "admin");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !isChoosingToSplit &&
        !isTransitioning
      ) {
        setSelectedCell(null);
        setIsChoosingToSplit(false);
        setDropdownCell(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSelectedCell, setIsChoosingToSplit, isChoosingToSplit, isTransitioning]);

  const handleAddSingleCellWithTransition = () => {
    if (!selectedCell) return;
    setIsTransitioning(true);
    handleAddSingleCell();
    setIsChoosingToSplit(false);
    setTimeout(() => setIsTransitioning(false), 50);
  };

  const handleSplitCellWithTransition = () => {
    if (!selectedCell) return;
    setIsTransitioning(true);
    handleSplitCell();
    setIsChoosingToSplit(false);
    setTimeout(() => setIsTransitioning(false), 50);
  };

  const handleCellClickWithDropdown = (row, col, subCellId = null) => {
    const cellId = subCellId || `${col}-${row}`;
    const cell = newCells && newCells[col]?.find((c) => c.row === row);
    handleCellClick(row, col);
    if (cell || subCellId) setDropdownCell(cellId);
    else setDropdownCell(null);
  };

  const getCellColor = (status) => {
    switch (status) {
      case 0: return "bg-white text-black";
      case 1: return "bg-green-500 text-white";
      case 2: return "bg-red-500 text-white";
      case 3: return "bg-gray-500 text-white";
      default: return "bg-white text-black";
    }
  };

  const baseColumnWidth = 9;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${columns.length * baseColumnWidth + (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) + paddingWidth}rem`;

  if (error) {
    return (
      <div>
        <HeaderManageLocation />
        <div className="p-4 max-w-6xl mx-auto w-full mt-[50px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeaderManageLocation />
      <div className="p-4 max-w-6xl mx-auto w-full mt-[50px]">
        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <div></div>
            <button
              onClick={handleAddCell}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <PlusCircleOutlined className="mr-2" />
              Add Location
            </button>
          </div>
          <div className="relative">
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
                      const isDropdownOpen = dropdownCell === cellId;

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
                              : `${getCellColor(status)} border border-gray-200 rounded-sm hover:bg-gray-100`
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!hasSubCells) handleCellClickWithDropdown(row, col);
                          }}
                        >
                          {hasSubCells ? (
                            cell.subCells.map((subCell) => {
                              const subCellStatus = cellStatus[subCell.id] !== undefined ? cellStatus[subCell.id] : 0;
                              const isSubCellDropdownOpen = dropdownCell === subCell.id;
                              return (
                                <div
                                  key={subCell.id}
                                  className={`h-16 flex-1 ${getCellColor(subCellStatus)} border border-gray-200 rounded-sm flex items-center justify-center relative`}
                                  style={{ width: `${baseColumnWidth / 2}rem` }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCellClickWithDropdown(row, col, subCell.id);
                                  }}
                                >
                                  <div className="text-xs">{subCell.id}</div> {/* แสดงชื่อเต็ม เช่น A-01-A */}
                                  {isSubCellDropdownOpen && (
                                    <div className="absolute z-10 top-16 left-0 bg-white border border-gray-200 rounded shadow-md">
                                      <select
                                        value=""
                                        onChange={(e) => {
                                          console.log("Selected action:", e.target.value, "for subcell:", subCell.id);
                                          handleCellStatusChange(subCell.id, e.target.value);
                                        }}
                                        className="p-2 w-32 bg-white text-black"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <option value="" disabled>เลือกสถานะ</option>
                                        {subCellStatus === 3 && <option value="enabled">เปิดใช้งาน</option>}
                                        {(subCellStatus === 1 || subCellStatus === 2) && (
                                          <option value="disabled">ปิดการใช้งาน</option>
                                        )}
                                        {(subCellStatus === 1 || subCellStatus === 2 || subCellStatus === 3) && (
                                          <option value="reset">รีเซ็ตเซลล์</option>
                                        )}
                                        {subCellStatus === 0 && <option value="enabled">เปิดใช้งาน</option>}
                                        {subCellStatus === 1 && <option value="full">เต็ม</option>}
                                        {subCellStatus === 2 && <option value="enabled">ว่าง</option>}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">{col}-{row}</div>
                          )}
                          {!hasSubCells && isDropdownOpen && (
                            <div className="absolute z-10 top-16 left-0 bg-white border border-gray-200 rounded shadow-md">
                              <select
                                value=""
                                onChange={(e) => {
                                  console.log("Selected action:", e.target.value, "for cell:", cellId);
                                  handleCellStatusChange(cellId, e.target.value);
                                }}
                                className="p-2 w-32 bg-white text-black"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="" disabled>เลือกสถานะ</option>
                                {status === 3 && <option value="enabled">เปิดใช้งาน</option>}
                                {(status === 1 || status === 2) && <option value="disabled">ปิดการใช้งาน</option>}
                                {(status === 1 || status === 2 || status === 3) && (
                                  <option value="reset">รีเซ็ตเซลล์</option>
                                )}
                                {status === 0 && <option value="activate">เปิดใช้งาน (เลือกแบบ)</option>}
                                {status === 1 && <option value="full">เต็ม</option>}
                                {status === 2 && <option value="enabled">ว่าง</option>}
                              </select>
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
          </div>
          <Modal
            title="จัดการเซลล์"
            open={isChoosingToSplit}
            onCancel={() => {
              setIsChoosingToSplit(false);
              setSelectedCell(null);
            }}
            footer={null}
          >
            <div className="flex flex-col items-center">
              <p className="text-sm mb-4">ต้องการแบ่งเซลล์เป็น 2 ส่วนหรือไม่?</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleSplitCellWithTransition}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ใช่ (แบ่งเป็น 2)
                </button>
                <button
                  onClick={handleAddSingleCellWithTransition}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  ไม่ (เซลล์เดี่ยว)
                </button>
                <button
                  onClick={() => {
                    setIsChoosingToSplit(false);
                    setSelectedCell(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </Modal>
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
        </div>
      </div>
    </div>
  );
};

export default Managelocation;