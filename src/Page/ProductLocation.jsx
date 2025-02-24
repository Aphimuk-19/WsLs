// src/Page/ProductLocation.jsx
import React, { useContext, useRef, useEffect } from "react";
import { LocationContext } from "../Context/LocationContext";

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
    <div className="p-4 max-w-6xl mx-auto w-full mt-[50px]">
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
                    newCells[col]?.find((cell) => cell.row === row)?.capacity ||
                    0;
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
                                handleCellStatusChange(cellId, e.target.value)
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
      <div className="flex justify-center items-center  h-[325px] bg-white border border-black/50 mt-7 mx-auto">
        <div>
          <p>สินค้าใน</p>
        </div>
        
      </div>
    </div>
  );
};

export default ProductLocation;
