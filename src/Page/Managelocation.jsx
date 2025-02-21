import React, { useState, useRef, useEffect } from "react";
import HeaderManageLocation from "../Custom/HeaderManageLocation";

const Managelocation = () => {
  // State variables
  const [columns, setColumns] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [rows, setRows] = useState(["04", "03", "02", "01"]);
  const [cellCount, setCellCount] = useState(1);
  const [newCells, setNewCells] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellStatus, setCellStatus] = useState({});
  const [capacity, setCapacity] = useState(1); // Capacity state
  const [popupCapacity, setPopupCapacity] = useState(1); // Popup capacity state

  const tableRef = useRef(null);

  // Handle column addition
  const handleAddColumn = () => {
    if (capacity < 1 || capacity > 10) {
      alert("กรุณากำหนดขนาด Capacity ระหว่าง 1 ถึง 10");
      return;
    }

    const newColumn = String.fromCharCode(
      columns[columns.length - 1].charCodeAt(0) + 1
    );
    setColumns([...columns, newColumn]);

    const rowsToAdd = rows.slice(0, 4); // Adjust this as needed for more rows

    const availableRows = rowsToAdd
      .map((row, index) => {
        if (index >= 4 - cellCount) {
          return {
            row,
            column: newColumn,
            id: `${row}-${newColumn}`,
            capacity,
          };
        } else {
          return null;
        }
      })
      .filter((cell) => cell !== null);

    setNewCells((prevCells) => ({
      ...prevCells,
      [newColumn]: availableRows,
    }));
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    const cellId = `${row}-${col}`;

    if (cellStatus[cellId] === "disabled") {
      setCellStatus((prevStatus) => ({
        ...prevStatus,
        [cellId]: "enabled",
      }));
      return;
    }

    if (!newCells[col]?.some((cell) => cell.row === row)) {
      setSelectedCell(cellId);
      setPopupCapacity(1); // Reset popup capacity
    } else {
      setSelectedCell(cellId);
    }
  };

  // Add cell to empty slot
  const handleAddCellToEmptySlot = () => {
    const [row, col] = selectedCell.split("-");
    setNewCells((prevCells) => ({
      ...prevCells,
      [col]: [
        ...(prevCells[col] || []),
        { row, column: col, id: selectedCell, capacity: popupCapacity },
      ],
    }));
    setSelectedCell(null);
  };

  // Handle cell status change
  const handleCellStatusChange = (cellId, status) => {
    setCellStatus((prevStatus) => ({
      ...prevStatus,
      [cellId]: status,
    }));
    setSelectedCell(null);
  };

  // Handle click outside to close selected cell popup
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
  }, []);

  return (
    <div>
      <div>
        <HeaderManageLocation />
      </div>
      {/* Cell Configuration Section */}
      <div className="p-4 max-w-6xl mx-auto w-full mt-[40px]">
        <div className="flex flex-col">
          <div className="flex justify-end mb-4 space-x-4">
            <label className="text-sm mr-2"></label>
            <select
              value={cellCount}
              onChange={(e) => setCellCount(Number(e.target.value))}
              className="px-4 py-2 border rounded"
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
              className="px-4 py-2 border rounded"
              min="1"
              max="10"
            />
            <button
              onClick={handleAddColumn}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Location
            </button>
          </div>

          {/* Table with Cells */}
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
              {/* Grid Display */}
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
                          {/* Cell Popup for Capacity */}
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
                          {/* Add Capacity Popup for Empty Slot */}
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

              {/* Column Headers */}
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
           {/* Status Legend */}
           <div className="flex items-center justify-start mt-10 space-x-20 ml-[37px]">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#0A8F08] border border-gray-200 rounded-full mr-2 "></div>
              <span className="text-sm">พื้นที่ว่าง</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#F2383A] border border-gray-200 rounded-full mr-2"></div>
              <span className="text-sm">พื้นที่ไม่ว่าง</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#121212]/75 text-{gray-600} border border-gray-200 rounded-full mr-2"></div>
              <span className="text-sm">ปิดการใช้งาน</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managelocation;
