import React, { useContext } from "react";
import { LocationContext } from "../Context/LocationContext";

const DashboardLocationView = () => {
  const { columns, rows, newCells, cellStatus } = useContext(LocationContext);

  // คำนวณความกว้างคงที่ให้ตรงกับ Managelocation
  const baseColumnWidth = 9; // ความกว้างพื้นฐานต่อคอลัมน์ (rem)
  const gapWidth = 0.25; // gap-1 = 0.25rem ใน Tailwind
  const paddingWidth = 0.5; // p-1 = 0.5rem (ซ้าย + ขวา)
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${columns.length * baseColumnWidth + (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) + paddingWidth}rem`;

  return (
    <div className="p-2 w-full h-full flex justify-center items-center">
      <div className="flex flex-col max-w-[800px] max-h-[400px]">
        <div className="flex overflow-x-auto">
          {/* Row Labels */}
          <div className="flex flex-col justify-between mr-2 pt-1">
            {rows.map((row) => (
              <div key={row} className="h-12 flex items-center text-gray-600 text-xs">
                {row}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 flex flex-col">
            <div
              className="grid gap-1 border border-gray-200 rounded-md bg-white p-1 box-border"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, ${columnWidth})`,
                width: totalWidth,
              }}
            >
              {rows.map((row) => (
                <React.Fragment key={row}>
                  {columns.map((col) => {
                    const cellId = `${col}-${row}`; // เปลี่ยนเป็น ${col}-${row}
                    const cell = newCells[col]?.find((c) => c.row === row);
                    const isDisabled = cellStatus[cellId] === "disabled";
                    const hasSubCells = cell?.subCells?.length > 0;

                    return (
                      <div
                        key={cellId}
                        className={`h-14 ${
                          hasSubCells
                            ? "flex space-x-1 bg-transparent"
                            : `${cell ? (isDisabled ? "bg-[#121212]/75 text-white" : "bg-green-500") : "bg-gray-50"} border border-gray-200 rounded-sm`
                        } relative`}
                      >
                        {hasSubCells ? (
                          cell.subCells.map((subCell) => (
                            <div
                              key={subCell.id}
                              className={`h-14 flex-1 ${isDisabled ? "bg-[#121212]/75 text-white" : "bg-green-500"} border border-gray-200 rounded-sm flex items-center justify-center relative`}
                              style={{ width: `${baseColumnWidth / 2 - 0.25}rem` }} // ปรับให้พอดีกับ subCells
                            >
                              <div className="text-xs">{subCell.id}</div>
                              <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">
                                ความจุ: {subCell.capacity}
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center justify-center text-xs h-full w-full">
                              {col}-{row} {/* เปลี่ยนเป็น ${col}-${row} */}
                            </div>
                            {cell && (
                              <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">
                                ความจุ: {cell.capacity}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Column Labels */}
            <div
              className="flex mt-1 px-1 gap-1" // เพิ่ม gap-1 ให้ตรงกับตาราง
              style={{ width: totalWidth }}
            >
              {columns.map((col) => (
                <div
                  key={col}
                  className="flex items-center justify-center text-gray-600 text-xs"
                  style={{ width: columnWidth, minWidth: columnWidth }}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-start mt-2 space-x-10 ml-[20px]">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#0A8F08] border border-gray-200 rounded-full mr-1"></div>
            <span className="text-xs">พื้นที่ว่าง</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#F2383A] border border-gray-200 rounded-full mr-1"></div>
            <span className="text-xs">พื้นที่ไม่ว่าง</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#121212]/75 border border-gray-200 rounded-full mr-1"></div>
            <span className="text-xs">ปิดการใช้งาน</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLocationView;