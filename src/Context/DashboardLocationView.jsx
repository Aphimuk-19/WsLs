import React, { useContext } from "react";
import { LocationContext } from "../Context/LocationContext";

const DashboardLocationView = () => {
  const { columns, rows, newCells, cellStatus } = useContext(LocationContext);

  const getCellColor = (status, cellId = null) => {
    const isSubCell = cellId && (cellId.includes("-A") || cellId.includes("-B"));
    if (isSubCell) {
      switch (status) {
        case 0: return "bg-white text-black";
        case 1: return "bg-[#0A8F08] text-white"; // เปลี่ยน subcell สถานะ 1 เป็น #0A8F08
        case 2: return "bg-red-500 text-white";
        case 3: return "bg-gray-500 text-white";
        case "disabled": return "bg-[#121212]/75 text-white";
        default: return "bg-white text-black";
      }
    }
    switch (status) {
      case 0: return "bg-white text-black";
      case 1: return "bg-green-500 text-white"; // cell ปกติยังใช้ green-500
      case 2: return "bg-red-500 text-white";
      case 3: return "bg-gray-500 text-white";
      case "disabled": return "bg-[#121212]/75 text-white";
      default: return "bg-white text-black";
    }
  };

  const baseColumnWidth = 7;
  const gapWidth = 0.25;
  const paddingWidth = 0.5;
  const rowHeight = 3;

  let totalWidth = columns.length * baseColumnWidth + (columns.length - 1) * gapWidth + paddingWidth * 2;
  const maxWidth = 52.6875; // ความกว้างสูงสุดใน rem (875px - 2rem padding)
  totalWidth = Math.min(totalWidth, maxWidth);

  let totalHeight = rows.length * rowHeight + 2 + 2; // 2rem สำหรับส่วนล่าง + 2rem สำหรับ legend
  const maxHeight = 19.4375; // ความสูงสูงสุดใน rem (343px - 2rem padding)
  totalHeight = Math.min(totalHeight, maxHeight);

  return (
    <div
      className="p-1 flex flex-col overflow-auto"
      style={{ width: `${totalWidth}rem`, height: `${totalHeight}rem` }}
    >
      <div className="flex-1">
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
                gridTemplateColumns: `repeat(${columns.length}, ${baseColumnWidth}rem)`,
              }}
            >
              {[...rows].reverse().map((row) =>
                columns.map((col) => {
                  const cellId = `${col}-${row}`;
                  const cell = newCells[col]?.find((c) => c.row === row);
                  const status = cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
                  const hasSubCells = cell?.subCells?.length > 0;

                  if (!cell) return <div key={cellId} className="h-12" />;

                  return (
                    <div
                      key={cellId}
                      className={`h-12 relative ${
                        hasSubCells
                          ? "flex space-x-1 bg-transparent"
                          : `${getCellColor(status, cellId)} border border-gray-200 rounded-sm`
                      }`}
                    >
                      {hasSubCells ? (
                        cell.subCells.map((subCell) => (
                          <div
                            key={subCell.id}
                            className={`h-12 flex-1 ${getCellColor(cellStatus[subCell.id] || 0, subCell.id)} border border-gray-200 rounded-sm flex items-center justify-center relative`}
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
      <div className="flex mt-1 px-1 gap-1">
        {columns.map((col) => (
          <div
            key={col}
            className="flex items-center justify-center text-gray-600 text-xs"
            style={{ width: `${baseColumnWidth}rem`, minWidth: `${baseColumnWidth}rem` }}
          >
            {col}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLocationView;