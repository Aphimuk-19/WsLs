import React, { useState } from "react";

const Managelocation = () => {
  // ข้อมูลคอลัมน์และแถว
  const [columns, setColumns] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [rows, setRows] = useState(["04", "03", "02", "01"]);
  const [cellCount, setCellCount] = useState(1); // จำนวนเซลล์ที่ต้องการเพิ่มในคอลัมน์ใหม่
  const [newCells, setNewCells] = useState({}); // เก็บเซลล์ใหม่ที่เพิ่ม

  // ฟังก์ชันเพิ่มคอลัมน์ใหม่
  const handleAddColumn = () => {
    const newColumn = String.fromCharCode(columns[columns.length - 1].charCodeAt(0) + 1);
    setColumns([...columns, newColumn]);

    // เพิ่มเซลล์ตามจำนวนที่เลือก (cellCount)
    const cells = [];
    const rowsToAdd = rows.slice(0, 4); // จำนวนแถวที่คงที่ (แค่ 4 แถว)
    
    // ค้นหาช่องว่างในคอลัมน์ใหม่
    const availableRows = rowsToAdd.map((row, index) => {
      // หากช่องว่างในแถวยังไม่เต็ม และจำนวนเซลล์ที่ต้องการเพิ่มไม่เกินจำนวนที่เลือก
      if (index >= 4 - cellCount && !newCells[newColumn]?.some((cell) => cell.row === row)) {
        return { row, column: newColumn, id: `${row}-${newColumn}` };
      } else {
        return null; // ช่องว่างจะไม่ได้รับการเลือก
      }
    }).filter(cell => cell !== null);

    // เพิ่มเซลล์ใหม่ที่เลือกลงใน columns
    setNewCells((prevCells) => ({
      ...prevCells,
      [newColumn]: availableRows, // เพิ่มเซลล์ใหม่ที่เพิ่มเข้ามา
    }));
  };

  // ฟังก์ชันเพิ่มเซลล์ในคอลัมน์ที่มีช่องว่าง
  const handleAddCellToEmptySlot = (column) => {
    const availableRows = rows.map((row, index) => {
      if (!newCells[column]?.some((cell) => cell.row === row)) {
        return { row, column, id: `${row}-${column}` };
      }
      return null;
    }).filter((cell) => cell !== null);

    if (availableRows.length > 0) {
      setNewCells((prevCells) => ({
        ...prevCells,
        [column]: [...(prevCells[column] || []), ...availableRows],
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
        {/* คอนเทนเนอร์หลัก */}
        <div className="flex flex-col">
          {/* ป้ายกำกับคอลัมน์ด้านบน */}
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
                  gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                }}
              >
                {/* เซลล์ของตารางกริด */}
                {rows.map((row) => (
                  <React.Fragment key={row}>
                    {columns.map((col) => {
                      const isCellAvailable = newCells[col]?.find(
                        (cell) => cell.row === row
                      );
                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`h-16 ${
                            isCellAvailable ? "bg-green-500" : "bg-gray-50"
                          } border border-gray-200 rounded-sm hover:bg-gray-100`}
                          onClick={() => handleAddCellToEmptySlot(col)} // เพิ่มเซลล์ในช่องว่าง
                        />
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

          {/* คำอธิบายสัญลักษณ์ */}
          <div className="flex mt-6 space-x-8">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-600">พื้นที่ว่าง</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm text-gray-600">พื้นที่ไม่ว่าง</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-gray-800 mr-2"></span>
              <span className="text-sm text-gray-600">ปิดการใช้งาน</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managelocation;
