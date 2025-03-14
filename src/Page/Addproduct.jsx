import React, { useContext, useEffect } from "react";
import { LocationContext } from "../Context/LocationContext";

const Addproduct = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    handleCellClick,
  } = useContext(LocationContext);

  console.log("Addproduct rendered with columns:", columns);
  console.log("Addproduct rendered with newCells:", newCells);

  useEffect(() => {
    console.log("Addproduct useEffect - columns updated:", columns);
    console.log("Addproduct useEffect - newCells updated:", newCells);
  }, [columns, newCells]);

  const handleCellClickWithDropdown = (row, col, subCellId = null) => {
    const cellId = subCellId ? subCellId : `${col}-${row}`;
    const cell = newCells[col]?.find((c) => c.row === row);

    handleCellClick(row, col);

    if (cell && cellStatus[cellId] !== "disabled") {
      setSelectedCell(cellId);
      console.log("Selected cell/sub-cell in Addproduct:", cellId);
    } else {
      setSelectedCell(null);
    }
  };

  const baseColumnWidth = 8;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${
    columns.length * baseColumnWidth +
    (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) +
    paddingWidth
  }rem`;

  const productData = [
    {
      id: "P001",
      name: "สินค้า A",
      total: 50,
      stored: 30,
      remaining: 20,
      location: "A-01",
    },
    {
      id: "P002",
      name: "สินค้า B",
      total: 100,
      stored: 70,
      remaining: 30,
      location: "B-02",
    },
    {
      id: "P003",
      name: "สินค้า C",
      total: 25,
      stored: 10,
      remaining: 15,
      location: "C-03",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[1050px] max-h-[110vh] relative bg-white rounded-[7px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="p-6 flex justify-between items-center border-b border-[#E1E8F1]">
          <h1 className="text-black text-xl font-bold">จัดการสินค้าในคลัง</h1>
          <p className="text-sm">
            รหัสบิล: <span>INV20250306-001</span>
          </p>
        </div>
        <div className="flex flex-col justify-start items-center w-full mt-5 px-4">
          {/* Bill Details Section */}
          <div className="flex justify-center w-full">
            <div className="p-3 w-[983px] h-[100px] relative bg-gray-100 mb-4">
              <h1 className="text-black text-sm font-semibold mb-4">
                รายละเอียดบิล
              </h1>
              <p className="text-black text-xs mb-2">วันที่: 6 มีนาคม 2568</p>
              <p className="text-black text-xs">
                จำนวนรายการสินค้า: <span>10</span> <span>รายการ</span>
              </p>
            </div>
          </div>
          {/* Table Section (Grid) */}
          <div className="flex justify-center w-full mt-3">
            <div className="w-[983px]">
              <div className="flex overflow-x-auto">
                <div className="flex flex-col justify-between mr-3 pt-1 shrink-0">
                  {rows.map((row) => (
                    <div
                      key={row}
                      className="h-14 flex items-center text-gray-600 text-sm"
                    >
                      {row}
                    </div>
                  ))}
                </div>
                <div className="flex-1 flex flex-col">
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
                          const cell = newCells[col]?.find(
                            (c) => c.row === row
                          );
                          const isDisabled = cellStatus[cellId] === "disabled";
                          const hasSubCells = cell?.subCells?.length > 0;

                          return (
                            <div
                              key={cellId}
                              className={`h-14 relative flex space-x-2 bg-transparent`}
                              onClick={(e) => {
                                if (!hasSubCells) {
                                  e.stopPropagation();
                                  handleCellClickWithDropdown(row, col);
                                }
                              }}
                            >
                              {hasSubCells ? (
                                cell.subCells.map((subCell) => {
                                  const subCellId = subCell.id;
                                  const isSubCellSelected =
                                    selectedCell === subCellId;
                                  const isSubCellDisabled =
                                    cellStatus[subCellId] === "disabled";

                                  return (
                                    <div
                                      key={subCell.id}
                                      className={`h-14 flex-1 border border-gray-200 rounded-sm flex items-center justify-center ${
                                        isSubCellDisabled
                                          ? "bg-gray-500 text-white"
                                          : isSubCellSelected
                                          ? "bg-blue-500 text-white"
                                          : "bg-green-500"
                                      } hover:bg-blue-400 hover:text-white`}
                                      style={{
                                        width: `${
                                          baseColumnWidth / 2 - 0.5
                                        }rem`,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCellClickWithDropdown(
                                          row,
                                          col,
                                          subCell.id
                                        );
                                      }}
                                    >
                                      <div className="text-sm">
                                        {subCell.id.split("-")[2]}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div
                                  className={`h-14 relative border border-gray-200 rounded-sm flex items-center justify-center w-full text-sm ${
                                    cell
                                      ? isDisabled
                                        ? "bg-gray-500 text-white"
                                        : selectedCell === cellId
                                        ? "bg-blue-500 text-white"
                                        : "bg-green-500"
                                      : "bg-gray-50"
                                  } hover:bg-blue-400 hover:text-white`}
                                >
                                  {col}-{row}
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
                    style={{ width: totalWidth }}
                  >
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
              <div className="flex items-center justify-start mt-10 space-x-20 ml-[37px]">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#0A8F08] border border-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm">พื้นที่ว่าง</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#f2383a] border border-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm">เปิดใช้งาน</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 border border-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm">ปิดการใช้งาน</span>
                </div>
              </div>
              <div className="w-[983px] h-[149px] relative bg-gray-100 p-4 mt-4">
                <h1 className="text-black text-base font-semibold">
                  ข้อมูลจัดเก็บ: <span>{selectedCell || "ยังไม่ได้เลือก"}</span>
                </h1>
                <p className="text-black text-[13px] font-medium">
                  สถานะ: <span className="text-[#0a8f08]">พร้อมใช้งาน</span>
                </p>
                <p className="text-black text-[13px] font-medium">
                  Location : <span className="text-blue-500">A1 , A2 , A3</span>
                </p>
                <button className="text-white w-[68px] h-[25px] relative bg-[#0a8f08]/75 rounded-[5px] border border-[#0a8f08] mt-5">
                  ใช้ช่องนี้
                </button>
              </div>
            </div>
          </div>
          {/* Product Table Section */}
          <div className="flex justify-center w-full mt-4">
            <div className="w-[983px] mb-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="p-2 text-sm text-center">รหัสสินค้า</th>
                    <th className="p-2 text-sm text-center">ชื่อสินค้า</th>
                    <th className="p-2 text-sm text-center">จำนวนสินค้า</th>
                    <th className="p-2 text-sm text-center">จัดเก็บแล้ว</th>
                    <th className="p-2 text-sm text-center">คงเหลือ</th>
                    <th className="p-2 text-sm text-center">ช่องจัดเก็บ</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-300 hover:bg-gray-50"
                    >
                      <td className="p-2 text-sm text-center">{product.id}</td>
                      <td className="p-2 text-sm text-center">
                        {product.name}
                      </td>
                      <td className="p-2 text-sm text-center">
                        {product.total}
                      </td>
                      <td className="p-2 text-sm text-center">
                        {product.stored}
                      </td>
                      <td className="p-2 text-sm text-center">
                        {product.remaining}
                      </td>
                      <td className="p-2 text-sm text-center">
                        {product.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Buttons Section */}
          <div className="flex justify-end pl-4 mt-4 p-10">
            <button className="w-[80px] h-[35px] bg-[#0a8f08] text-white rounded-[5px] border border-[#0a8f08] hover:bg-[#067d06] mr-4">
              ตกลง
            </button>
            <button className="w-[80px] h-[35px] bg-gray-500 text-white rounded-[5px] border border-gray-600 hover:bg-gray-600">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addproduct;
