import React, { useContext } from "react";
import { LocationContext } from "../Context/LocationContext";

const DashboardLocationView = () => {
  const { columns, rows, newCells, cellStatus } = useContext(LocationContext);

  return (
    <div className="p-2 w-full h-full flex justify-center items-center">
      <div className="flex flex-col max-w-[800px] max-h-[400px]">
        <div className="flex overflow-x-auto">
          {/* ป้ายชื่อแถว */}
          <div className="flex flex-col justify-between mr-2 pt-1">
            {rows.map((row) => (
              <div
                key={row}
                className="h-12 flex items-center text-gray-600 text-xs"
              >
                {row}
              </div>
            ))}
          </div>

          {/* ตาราง */}
          <div className="flex-1 flex flex-col">
            <div
              className="grid gap-1 border border-gray-200 rounded-md bg-white p-1"
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
                        className={`h-14 w-27 ${
                          isCellAvailable
                            ? isDisabled
                              ? "bg-[#121212]/75 text-white"
                              : "bg-green-500"
                            : "bg-gray-50"
                        } border border-gray-200 rounded-sm relative`}
                      >
                        <div className="flex items-center justify-center text-xs">
                          {row}-{col}
                        </div>
                        {isCellAvailable && (
                          <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">
                            ความจุ: {cellCapacity}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* ป้ายชื่อคอลัมน์ */}
            <div className="flex mt-1 px-1">
              {columns.map((col) => (
                <div
                  key={col}
                  className="flex-1 text-center text-gray-600 text-xs"
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* คำอธิบายสี */}
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