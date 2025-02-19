import React, { useState } from "react";

const Managelocation = () => {
  const [columns, setColumns] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [rows, setRows] = useState(["04", "03", "02", "01"]);
  const [cellCount, setCellCount] = useState(1); // จำนวนเซลล์ที่ต้องการเพิ่มในคอลัมน์ใหม่
  const [newCells, setNewCells] = useState({}); // เก็บเซลล์ใหม่ที่เพิ่ม
  const [splitCells, setSplitCells] = useState({}); // เก็บข้อมูลการแบ่งเซลล์
  const [selectedCell, setSelectedCell] = useState(null); // เซลล์ที่เลือก
  const [splitParts, setSplitParts] = useState(2); // จำนวนส่วนที่จะแบ่ง

  // ฟังก์ชันเพิ่มคอลัมน์ใหม่
  const handleAddColumn = () => {
    const newColumn = String.fromCharCode(columns[columns.length - 1].charCodeAt(0) + 1);
    setColumns([...columns, newColumn]);

    const rowsToAdd = rows.slice(0, 4); // จำนวนแถวที่คงที่ (แค่ 4 แถว)
    
    const availableRows = rowsToAdd.map((row, index) => {
      if (index >= 4 - cellCount) { // เริ่มจากด้านล่าง
        return { row, column: newColumn, id: `${row}-${newColumn}` };
      } else {
        return null; // เว้นช่องว่าง
      }
    }).filter(cell => cell !== null);

    setNewCells((prevCells) => ({
      ...prevCells,
      [newColumn]: availableRows, // เพิ่มเซลล์ใหม่ที่เพิ่มเข้ามา
    }));
  };

  // ฟังก์ชันคลิกเซลล์เพื่อเลือกเซลล์
  const handleCellClick = (row, col) => {
    const cellId = `${row}-${col}`;
    setSelectedCell(cellId); // กำหนดเซลล์ที่เลือก
  };

  // ฟังก์ชันการแบ่งเซลล์
  const handleSplitCell = () => {
    if (selectedCell) {
      setSplitCells((prev) => ({
        ...prev,
        [selectedCell]: splitParts, // เก็บข้อมูลการแบ่งเซลล์
      }));
    }
  };

  return (
    <div>
      <div className="flex space-x-7 items-center justify-center mt-[40px]">
        <div className="w-[268px] h-[116px] bg-white rounded-[10px]"></div>
        <div className="w-[268px] h-[116px] bg-white rounded-[10px]"></div>
        <div className="w-[268px] h-[116px] bg-white rounded-[10px]"></div>
        <div className="w-[268px] h-[116px] bg-white rounded-[10px]"></div>
        <div className="w-[268px] h-[116px] bg-white rounded-[10px]"></div>
      </div>
      <div className="p-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex mb-2 ml-12">
            <div className="text-gray-500 text-sm">คอลัมน์</div>
          </div>

          {/* ปุ่มเพิ่มคอลัมน์ */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAddColumn}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              เพิ่มคอลัมน์ใหม่
            </button>
          </div>

          {/* ตัวเลือกจำนวนเซลล์ที่ต้องการเพิ่มในคอลัมน์ใหม่ */}
          <div className="flex justify-end mb-4">
            <label className="text-sm mr-2">เลือกจำนวนเซลล์:</label>
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
          </div>

          {/* ตัวเลือกจำนวนส่วนที่จะทำการแบ่ง */}
          <div className="flex justify-end mb-4">
            <label className="text-sm mr-2">เลือกจำนวนส่วนในการแบ่งเซลล์:</label>
            <select
              value={splitParts}
              onChange={(e) => setSplitParts(Number(e.target.value))}
              className="px-4 py-2 border rounded"
            >
              <option value={2}>2 ส่วน</option>
              <option value={3}>3 ส่วน</option>
              <option value={4}>4 ส่วน</option>
            </select>
          </div>

          {/* เนื้อหาของตารางกริด */}
          <div className="flex overflow-x-auto">
            {/* ป้ายกำกับแถวด้านซ้าย */}
            <div className="flex flex-col justify-between mr-4 pt-1">
              {rows.map((row) => (
                <div key={row} className="h-16 flex items-center text-gray-600 text-sm">
                  {row}
                </div>
              ))}
            </div>

            {/* ตารางกริดหลัก */}
            <div className="flex-1 flex flex-col">
              <div
                className="grid gap-1 border border-gray-200 rounded-md bg-white p-2"
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, 1fr)`, // ทำให้ทุกคอลัมน์มีขนาดเท่ากัน
                }}
              >
                {/* เซลล์ของตารางกริด */}
                {rows.map((row) => (
                  <React.Fragment key={row}>
                    {columns.map((col) => {
                      const isCellAvailable = newCells[col]?.find(
                        (cell) => cell.row === row
                      );
                      const split = splitCells[`${row}-${col}`]; // ใช้ข้อมูลการแบ่งเซลล์
                      const cellId = `${row}-${col}`;
                      return (
                        <div
                          key={cellId}
                          className={`h-16 w-36 ${ // กำหนดความกว้างและความสูงให้คงที่
                            isCellAvailable ? "bg-green-500" : "bg-gray-50"
                          } border border-gray-200 rounded-sm hover:bg-gray-100`}
                          onClick={() => handleCellClick(row, col)} // คลิกเซลล์
                        >
                          {selectedCell === cellId && (
                            <div>
                              <button
                                onClick={handleSplitCell}
                                className="bg-blue-500 text-white rounded py-1 px-3 mt-2"
                              >
                                แบ่งเซลล์
                              </button>
                            </div>
                          )}
                          {split ? (
                            <div
                              className={`grid grid-rows-${split}`}
                              style={{ gridTemplateRows: `repeat(${split}, 1fr)` }}
                            >
                              {Array.from({ length: split }, (_, index) => (
                                <div key={index} className="border p-1">
                                  เซลล์ {index + 1}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              {row}-{col}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* ป้ายกำกับคอลัมน์ด้านล่าง */}
              <div className="flex mt-2 px-2">
                {columns.map((col) => (
                  <div key={col} className="flex-1 text-center text-gray-600 text-sm">
                    {col}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managelocation;
