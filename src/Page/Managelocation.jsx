import React, { useContext, useRef, useEffect, useState } from "react";
import HeaderManageLocation from "../Custom/HeaderManageLocation";
import { LocationContext } from "../Context/LocationContext";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const Managelocation = () => {
  const {
    columns,
    rows,
    newCells,
    setNewCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    capacity,
    setCapacity,
    cellCount,
    setCellCount,
    subCellCount,
    setSubCellCount,
    handleAddColumn,
    handleCellClick,
    handleCellStatusChange,
    handleSetSubCellCapacity,
    handleSplitCell,
    handleAddSingleCell,
    handleSetSingleCellCapacity,
    isChoosingToSplit,
    setIsChoosingToSplit,
    isSettingCapacity,
    setIsSettingCapacity,
    isCapacitySet,
    setIsCapacitySet,
  } = useContext(LocationContext);

  const tableRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dropdownCell, setDropdownCell] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !isChoosingToSplit &&
        !isSettingCapacity &&
        !isTransitioning
      ) {
        setSelectedCell(null);
        setIsChoosingToSplit(false);
        setDropdownCell(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSelectedCell, setIsChoosingToSplit, isChoosingToSplit, isSettingCapacity, isTransitioning]);

  useEffect(() => {
    if (
      selectedCell &&
      newCells[selectedCell?.split("-")[0]]?.find((c) => c.id === selectedCell) &&
      !isCapacitySet[selectedCell] &&
      !isChoosingToSplit &&
      !isSettingCapacity
    ) {
      setIsSettingCapacity(true);
    }
  }, [selectedCell, newCells, isCapacitySet, isChoosingToSplit, isSettingCapacity, setIsSettingCapacity]);

  const handleAddSingleCellWithCapacity = () => {
    if (!selectedCell) return;
    setIsTransitioning(true);
    handleAddSingleCell();
    setIsChoosingToSplit(false);
    setTimeout(() => {
      setIsSettingCapacity(true);
      setIsTransitioning(false);
    }, 50);
  };

  const handleSplitCellWithCapacity = () => {
    if (!selectedCell) return;
    setIsTransitioning(true);
    handleSplitCell();
    setIsChoosingToSplit(false);
    setTimeout(() => {
      setIsSettingCapacity(true);
      setIsTransitioning(false);
    }, 50);
  };

  const handleCellClickWithDropdown = (row, col) => {
    const cellId = `${col}-${row}`;
    const cell = newCells[col]?.find((c) => c.row === row);
    handleCellClick(row, col);
    // แสดง dropdown ถ้า cell มี capacity และไม่ถูกปิดใช้งาน หรือถูกปิดใช้งานแล้วเพื่อให้เปลี่ยนกลับได้
    if (cell && isCapacitySet[cellId]) {
      setDropdownCell(cellId);
    } else {
      setDropdownCell(null);
    }
  };

  const handleStatusChange = (cellId, status) => {
    handleCellStatusChange(cellId, status);
    setDropdownCell(null); // ปิด dropdown หลังเลือก
  };

  const CapacityModal = () => {
    const [localCapacity1, setLocalCapacity1] = useState(0);
    const [localCapacity2, setLocalCapacity2] = useState(0);

    useEffect(() => {
      if (isSettingCapacity && selectedCell) {
        const [col] = selectedCell.split("-");
        const cellData = newCells[col]?.find((c) => c.id === selectedCell);
        if (cellData) {
          console.log("Loading cell data into modal:", cellData);
          setLocalCapacity1(cellData.capacity || 0);
          if (cellData.subCells?.length > 0) {
            setLocalCapacity1(cellData.subCells[0].capacity || 0);
            setLocalCapacity2(cellData.subCells[1].capacity || 0);
          }
        }
      }
    }, [isSettingCapacity, selectedCell, newCells]);

    if (!isSettingCapacity || !selectedCell) return null;

    const [col] = selectedCell.split("-");
    const cellData = newCells[col]?.find((c) => c.id === selectedCell);
    const hasSubCells = cellData?.subCells?.length > 0;

    const handleCapacitySave = (e) => {
      e.stopPropagation();
      const capacity1 = Number(localCapacity1);
      const capacity2 = Number(localCapacity2);
      console.log("Saving capacity:", { capacity1, capacity2, selectedCell });
      if (hasSubCells) {
        handleSetSubCellCapacity(selectedCell, capacity1, capacity2);
      } else {
        handleSetSingleCellCapacity(selectedCell, capacity1);
      }
      setIsCapacitySet((prev) => ({ ...prev, [selectedCell]: true }));
      setIsSettingCapacity(false);
      setSelectedCell(null);
    };

    const handleInputChange = (setter) => (e) => {
      e.stopPropagation();
      const value = Number(e.target.value);
      setter(value);
      console.log("Input changed:", value);
    };

    return (
      <Modal
        title="กำหนดขนาด Capacity"
        open={isSettingCapacity}
        onCancel={() => {
          setIsSettingCapacity(false);
          setSelectedCell(null);
        }}
        footer={null}
      >
        <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm mb-2">
            {hasSubCells ? "กำหนดขนาด Capacity สำหรับเซลล์ย่อย:" : "กำหนดขนาด Capacity:"}
          </p>
          {hasSubCells ? (
            <div className="flex space-x-4 mb-4">
              <input
                type="number"
                value={localCapacity1}
                onChange={handleInputChange(setLocalCapacity1)}
                className="px-4 py-2 border rounded w-20"
                min="1"
                max="10"
                placeholder={cellData?.subCells[0]?.id || ""}
              />
              <input
                type="number"
                value={localCapacity2}
                onChange={handleInputChange(setLocalCapacity2)}
                className="px-4 py-2 border rounded w-20"
                min="1"
                max="10"
                placeholder={cellData?.subCells[1]?.id || ""}
              />
            </div>
          ) : (
            <input
              type="number"
              value={localCapacity1}
              onChange={handleInputChange(setLocalCapacity1)}
              className="px-4 py-2 border rounded mb-4 w-20"
              min="1"
              max="10"
            />
          )}
          <button
            onClick={handleCapacitySave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!localCapacity1 || (hasSubCells && !localCapacity2)}
          >
            ตั้งค่า
          </button>
        </div>
      </Modal>
    );
  };

  const baseColumnWidth = subCellCount === 2 ? 18 : 9;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${columns.length * baseColumnWidth + (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) + paddingWidth}rem`;

  return (
    <div>
      <HeaderManageLocation />
      <div className="p-4 max-w-6xl mx-auto w-full mt-[50px]">
        <div className="flex flex-col">
          <div className="flex justify-end mb-4 space-x-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">จำนวนเซลล์ทั้งหมด</label>
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
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">ความจุต่อเซลล์</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="h-[37px] px-4 py-2 border rounded text-sm"
                min="1"
                max="10"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">จำนวนเซลล์ย่อย</label>
              <select
                value={subCellCount}
                onChange={(e) => setSubCellCount(Number(e.target.value))}
                className="h-[37px] px-4 py-2 border rounded text-sm"
              >
                <option value={1}>1 เซลล์ย่อย</option>
                <option value={2}>2 เซลล์ย่อย</option>
              </select>
            </div>
            <button
              onClick={handleAddColumn}
              className="h-[37px] px-4 py-2 bg-[#006ec4] rounded justify-center items-center gap-[7.92px] inline-flex text-white text-[15px] font-light leading-[19px] hover:bg-[#006ec4] hover:brightness-110 hover:shadow-md self-end"
            >
              <PlusCircleOutlined />
              Add Location
            </button>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto">
              <div className="flex flex-col justify-between mr-4 pt-1 shrink-0">
                {rows.map((row) => (
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
                  {rows.map((row) => (
                    <React.Fragment key={row}>
                      {columns.map((col) => {
                        const cellId = `${col}-${row}`;
                        const cell = newCells[col]?.find((c) => c.row === row);
                        const isDisabled = cellStatus[cellId] === "disabled";
                        const hasSubCells = cell?.subCells?.length > 0;
                        const isDropdownOpen = dropdownCell === cellId;

                        return (
                          <div
                            key={cellId}
                            className={`h-16 relative ${
                              hasSubCells
                                ? "flex space-x-2 bg-transparent"
                                : `${cell ? (isDisabled ? "bg-gray-500 text-white" : "bg-green-500") : "bg-gray-50"} border border-gray-200 rounded-sm hover:bg-gray-100`
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCellClickWithDropdown(row, col);
                            }}
                          >
                            {hasSubCells ? (
                              cell.subCells.map((subCell) => (
                                <div
                                  key={subCell.id}
                                  className={`h-16 flex-1 ${isDisabled ? "bg-gray-500 text-white" : "bg-green-500"} border border-gray-200 rounded-sm flex items-center justify-center relative`}
                                  style={{ width: `${baseColumnWidth / subCellCount - 0.5}rem` }}
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
                              </>
                            )}
                            {/* ปรับ dropdown ให้มีตัวเลือกทั้งปิดและเปิดใช้งาน */}
                            {isDropdownOpen && (
                              <div className="absolute z-10 top-16 left-0 bg-white border border-gray-300 rounded shadow-md">
                                <select
                                  value=""
                                  onChange={(e) => handleStatusChange(cellId, e.target.value)}
                                  className="p-2 w-32"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="" disabled>
                                    เลือกสถานะ
                                  </option>
                                  <option value="disabled">ปิดการใช้งาน</option>
                                  <option value="enabled">เปิดใช้งาน</option>
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <div
                  className="flex mt-2 px-2 gap-2"
                  style={{
                    width: totalWidth,
                  }}
                >
                  {columns.map((col) => (
                    <div
                      key={col}
                      className="flex items-center justify-center text-gray-600 text-sm"
                      style={{
                        width: columnWidth,
                        minWidth: columnWidth,
                      }}
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
              <p className="text-sm mb-4">ต้องการแบ่งเซลล์หรือไม่?</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleSplitCellWithCapacity}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ใช่
                </button>
                <button
                  onClick={handleAddSingleCellWithCapacity}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  ไม่ (เพิ่มเซลล์เดี่ยว)
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
          <CapacityModal />
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
              <div className="w-4 h-4 bg-gray-500 border border-gray-200 rounded-full mr-2"></div>
              <span className="text-sm">ปิดการใช้งาน</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managelocation;