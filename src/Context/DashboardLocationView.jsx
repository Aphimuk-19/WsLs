import React, { useContext } from "react";
import { LocationContext } from "../Context/LocationContext";

const DashboardLocationView = () => {
  const { columns, rows, newCells, cellStatus } = useContext(LocationContext);

  const getCellColor = (status) => {
    switch (status) {
      case 0: return "bg-white text-black";
      case 1: return "bg-green-500 text-white";
      case 2: return "bg-red-500 text-white";
      case 3: return "bg-gray-500 text-white";
      case "disabled": return "bg-[#121212]/75 text-white";
      default: return "bg-white text-black";
    }
  };

  const baseColumnWidth = 9; // ความกว้างต่อคอลัมน์ (rem)
  const gapWidth = 0.25; // ช่องว่างระหว่างคอลัมน์ (rem)
  const paddingWidth = 0.5; // padding รอบตาราง (rem)
  const maxColumns = Math.floor((875 - paddingWidth * 16) / (baseColumnWidth + gapWidth)); // คำนวณคอลัมน์สูงสุดใน 875px (แปลง rem เป็น px: 1rem = 16px)
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = columns.length > maxColumns 
    ? `${maxColumns * baseColumnWidth + (maxColumns - 1) * gapWidth + paddingWidth}rem`
    : `${columns.length * baseColumnWidth + (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) + paddingWidth}rem`;

  return (
    <div className="p-2 w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto"> {/* ให้ตารางเลื่อนเฉพาะแนวตั้ง */}
        <div className="flex">
          <div className="flex flex-col justify-between mr-2 pt-1 shrink-0">
            {[...rows].reverse().map((row) => (
              <div key={row} className="h-12 flex items-center text-gray-600 text-xs">
                {row}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div
              className="grid gap-1 border border-gray-200 rounded-md bg-white p-1 box-border"
              style={{
                gridTemplateColumns: `repeat(${Math.min(columns.length, maxColumns)}, ${columnWidth})`,
                width: totalWidth,
              }}
            >
              {[...rows].reverse().map((row) =>
                columns.slice(0, maxColumns).map((col) => { // จำกัดจำนวนคอลัมน์
                  const cellId = `${col}-${row}`;
                  const cell = newCells[col]?.find((c) => c.row === row);
                  const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
                  const hasSubCells = cell?.subCells?.length > 0;

                  if (!cell) return <div key={cellId} className="h-14" />;

                  return (
                    <div
                      key={cellId}
                      className={`h-14 relative ${
                        hasSubCells
                          ? "flex space-x-1 bg-transparent"
                          : `${getCellColor(status)} border border-gray-200 rounded-sm`
                      }`}
                    >
                      {hasSubCells ? (
                        cell.subCells.map((subCell) => (
                          <div
                            key={subCell.id}
                            className={`h-14 flex-1 ${getCellColor(cellStatus[subCell.id] || 0)} border border-gray-200 rounded-sm flex items-center justify-center relative`}
                            style={{ width: `${baseColumnWidth / 2 - 0.25}rem` }}
                          >
                            <div className="text-xs">{subCell.id.split("-").slice(-1)[0]}</div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center text-xs h-full w-full">
                          {col}-{row}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-1 px-1 gap-1" style={{ width: totalWidth }}>
        {columns.slice(0, maxColumns).map((col) => ( // จำกัดคอลัมน์ด้านล่างด้วย
          <div
            key={col}
            className="flex items-center justify-center text-gray-600 text-xs"
            style={{ width: columnWidth, minWidth: columnWidth }}
          >
            {col}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start mt-2 space-x-10 ml-[20px]">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white border border-gray-200 rounded-full mr-1"></div>
          <span className="text-xs">ไม่ใช้งาน</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 border border-gray-200 rounded-full mr-1"></div>
          <span className="text-xs">ใช้งาน</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 border border-gray-200 rounded-full mr-1"></div>
          <span className="text-xs">ซ่อมบำรุง</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 border border-gray-200 rounded-full mr-1"></div>
          <span className="text-xs">จอง</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#121212]/75 border border-gray-200 rounded-full mr-1"></div>
          <span className="text-xs">ปิดการใช้งาน</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLocationView;