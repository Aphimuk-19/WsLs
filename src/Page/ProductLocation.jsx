import React, { useContext, useRef, useEffect, useState } from "react";
import { LocationContext } from "../Context/LocationContext";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spin, message } from "antd";

const ProductLocation = () => {
  const {
    columns,
    rows,
    newCells,
    cellStatus,
    selectedCell,
    setSelectedCell,
    handleCellClick,
  } = useContext(LocationContext);

  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [otherLocations, setOtherLocations] = useState([]);

  const baseColumnWidth = 9;
  const gapWidth = 0.5;
  const paddingWidth = 1;
  const columnWidth = `${baseColumnWidth}rem`;
  const totalWidth = `${
    columns.length * baseColumnWidth +
    (columns.length > 1 ? (columns.length - 1) * gapWidth : 0) +
    paddingWidth
  }rem`;

  const BASE_URL = "http://172.18.43.37:3000";
  const DEFAULT_IMAGE_URL = "https://picsum.photos/40/40";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !event.target.closest(".modal") &&
        !event.target.closest(".search-icon")
      ) {
        console.log("handleClickOutside triggered", event.target);
        setSelectedCell(null);
        setProductsData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSelectedCell]);

  const fetchCellProducts = async (cellId) => {
    setLoadingTable(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

      const response = await axios.get(
        "http://172.18.43.37:3000/api/cell/cellsAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response from cellsAll:", response.data);

      if (!response.data.success) throw new Error("Invalid API response");

      const cellProducts = [];
      response.data.data.forEach((cell) => {
        const formatProduct = (product, location) => {
          const imageUrl =
            product.product.image && typeof product.product.image === "string"
              ? `${BASE_URL}${product.product.image}`
              : DEFAULT_IMAGE_URL;

          return {
            key: `${product.product.productId}-${location}-${Math.random()}`,
            no: cellProducts.length + 1,
            id: product.product.productId,
            type: product.product.type || "N/A",
            name: product.product.name || "Unknown",
            image: imageUrl,
            location: location,
            in: product.inDate
              ? new Date(product.inDate).toISOString().split("T")[0]
              : "N/A",
            end: product.endDate
              ? new Date(product.endDate).toISOString().split("T")[0]
              : "N/A",
            quantity: product.quantity || 0,
          };
        };

        if (
          cell.cellId === cellId &&
          cell.products &&
          cell.products.length > 0
        ) {
          cell.products.forEach((product) => {
            cellProducts.push(formatProduct(product, cell.cellId));
          });
        }

        if (
          cell.subCellsA &&
          cell.subCellsA.products &&
          cell.subCellsA.products.length > 0
        ) {
          const subCellAId = `${cell.cellId}-A`;
          if (subCellAId === cellId) {
            cell.subCellsA.products.forEach((product) => {
              cellProducts.push(formatProduct(product, subCellAId));
            });
          }
        }

        if (
          cell.subCellsB &&
          cell.subCellsB.products &&
          cell.subCellsB.products.length > 0
        ) {
          const subCellBId = `${cell.cellId}-B`;
          if (subCellBId === cellId) {
            cell.subCellsB.products.forEach((product) => {
              cellProducts.push(formatProduct(product, subCellBId));
            });
          }
        }
      });

      console.log("Formatted Products:", cellProducts);
      setProductsData(cellProducts);
    } catch (error) {
      console.error("Error fetching cell products:", error.message);
      if (error.response?.status === 401) {
        message.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setProductsData([]);
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
      }
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchOtherLocations = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

      const response = await axios.get(
        "http://172.18.43.37:3000/api/cell/cellsAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response for other locations:", response.data);

      if (!response.data.success) throw new Error("Invalid API response");

      const otherLocationsData = [];
      response.data.data.forEach((cell) => {
        const addProductLocation = (product, location) => {
          if (
            product.product.productId === productId &&
            location !== selectedCell
          ) {
            const imageUrl =
              product.product.image && typeof product.product.image === "string"
                ? `${BASE_URL}${product.product.image}`
                : DEFAULT_IMAGE_URL;

            otherLocationsData.push({
              productId: product.product.productId,
              name: product.product.name || "Unknown",
              image: imageUrl,
              location: location,
              quantity: product.quantity || 0,
            });
          }
        };

        if (cell.products && cell.products.length > 0) {
          cell.products.forEach((product) => {
            addProductLocation(product, cell.cellId);
          });
        }

        if (
          cell.subCellsA &&
          cell.subCellsA.products &&
          cell.subCellsA.products.length > 0
        ) {
          cell.subCellsA.products.forEach((product) => {
            addProductLocation(product, `${cell.cellId}-A`);
          });
        }

        if (
          cell.subCellsB &&
          cell.subCellsB.products &&
          cell.subCellsB.products.length > 0
        ) {
          cell.subCellsB.products.forEach((product) => {
            addProductLocation(product, `${cell.cellId}-B`);
          });
        }
      });

      console.log("Other Locations:", otherLocationsData);
      setOtherLocations(otherLocationsData);
      setIsSearchModalOpen(true);
    } catch (error) {
      console.error("Error fetching other locations:", error.message);
      if (error.response?.status === 401) {
        message.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setOtherLocations([]);
        setIsSearchModalOpen(true);
        message.error("เกิดข้อผิดพลาดในการดึงตำแหน่งอื่น");
      }
    }
  };

  const handleButtonClick = () => setIsModalOpen(true);

  const handleSubmit = async () => {
    if (billNumber.length !== 8) {
      setError("เลขที่บิลสินค้าต้องมี 8 ตัวอักษร");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

      const response = await axios.get(
        `http://172.18.43.37:3000/api/bill/billNumber/${billNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data);

      if (!response.data.success) throw new Error(response.data.error || "Invalid API response");

      const billData = response.data.data;
      if (!billData) {
        setError("ไม่พบเลขที่บิลนี้ในระบบ");
        setLoading(false);
        return;
      }

      setError("");
      setIsModalOpen(false);
      setLoading(false);
      message.success("สำเร็จ! กำลังเปิดแท็บใหม่...");

      localStorage.setItem("billData", JSON.stringify(billData));
      window.open("/Addproduct", "_blank");

      setTimeout(() => {
        setBillNumber("");
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Error validating bill number:", error.message, error.response?.data);
      if (error.response?.status === 401) {
        setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 400) {
        setError("เลขบิลไม่ถูกต้อง: ต้องเป็นสตริงและไม่ว่างเปล่า");
        message.error("เลขบิลไม่ถูกต้อง");
      } else if (error.response?.status === 404) {
        setError(`ไม่พบบิลที่มีเลขที่: ${billNumber}`);
        message.error("ไม่พบเลขที่บิลนี้ในระบบ");
      } else if (error.response?.status === 500) {
        setError("เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง");
        message.error("เกิดข้อผิดพลาดในเซิร์ฟเวอร์");
      } else {
        setError(error.message || "เกิดข้อผิดพลาดในการตรวจสอบเลขที่บิล");
        message.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    setBillNumber("");
    setError("");
    setIsModalOpen(false);
  };

  const handleSearchClick = (product, event) => {
    event.stopPropagation();
    setSelectedProduct(product);
    fetchOtherLocations(product.id);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const getBackgroundColor = (status, isSelected, cellId = null) => {
    if (isSelected) return "bg-blue-500";
    const isSubCell =
      cellId && (cellId.includes("-A") || cellId.includes("-B"));
    if (isSubCell) {
      switch (status) {
        case 0:
          return "bg-white";
        case 1:
          return "bg-[#0A8F08]";
        case 2:
          return "bg-red-500";
        case 3:
          return "bg-gray-500";
        default:
          return "bg-white";
      }
    }
    switch (status) {
      case 0:
        return "bg-white";
      case 1:
        return "bg-green-500";
      case 2:
        return "bg-red-500";
      case 3:
        return "bg-gray-500";
      default:
        return "bg-white";
    }
  };

  const getTextColor = (status, isSelected, cellId = null) => {
    if (isSelected) return "text-white";
    const isSubCell =
      cellId && (cellId.includes("-A") || cellId.includes("-B"));
    if (isSubCell) {
      switch (status) {
        case 0:
          return "text-black";
        case 1:
          return "text-white";
        case 2:
          return "text-white";
        case 3:
          return "text-white";
        default:
          return "text-black";
      }
    }
    switch (status) {
      case 0:
        return "text-black";
      case 1:
        return "text-white";
      case 2:
        return "text-white";
      case 3:
        return "text-white";
      default:
        return "text-black";
    }
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE_URL;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto w-full mt-[30px]">
      <div className="mb-6 flex items-center justify-end">
        <button
          className="w-[142px] h-[37px] p-[15.83px] bg-[#006ec4] rounded-lg justify-center items-center gap-[7.92px] inline-flex text-white text-[15px] font-light leading-[19px] hover:bg-[#006ec4] hover:brightness-110 hover:shadow-md"
          onClick={handleButtonClick}
        >
          <PlusCircleOutlined />
          In Bound
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <Spin spinning={loading} tip="กำลังตรวจสอบ...">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="bg-white p-8 rounded-lg shadow-xl w-[450px]"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                กรุณาใส่เลขที่บิลสินค้า
              </h2>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => {
                  setBillNumber(e.target.value);
                  setError("");
                }}
                className={`w-full p-3 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-[#006ec4] transition-all`}
                placeholder="เลขที่บิลสินค้า"
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition-all"
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-[#006ec4] text-white rounded-lg hover:bg-[#006ec4] hover:brightness-110 font-medium transition-all"
                  disabled={loading}
                >
                  ตกลง
                </button>
              </div>
            </form>
          </Spin>
        </div>
      )}

      <div className="flex overflow-x-auto">
        <div className="flex flex-col justify-between mr-4 pt-1 shrink-0">
          {[...rows].reverse().map((row) => (
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
            className="grid gap-2 border border-gray-200 rounded-md bg-white p-2 box-border"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, ${columnWidth})`,
              width: totalWidth,
            }}
          >
            {[...rows].reverse().map((row) =>
              columns.map((col) => {
                const cellId = `${col}-${row}`;
                const cell = newCells[col]?.find((c) => c.row === row);
                const status =
                  cellStatus[cellId] !== undefined ? cellStatus[cellId] : 0;
                const hasSubCells = cell?.subCells?.length > 0;
                const isSelected = selectedCell === cellId;

                if (!cell) {
                  return (
                    <div
                      key={cellId}
                      className="h-16"
                      onClick={() => handleCellClick(row, col)}
                    />
                  );
                }

                return (
                  <div
                    key={cellId}
                    className={`h-16 relative ${
                      hasSubCells
                        ? "flex space-x-1 bg-transparent"
                        : `${getBackgroundColor(
                            status,
                            isSelected,
                            cellId
                          )} border border-gray-200 rounded-sm hover:bg-opacity-75 cursor-pointer`
                    }`}
                    onClick={() => {
                      console.log("Clicked Cell:", cellId);
                      handleCellClick(row, col);
                      setSelectedCell(cellId);
                      if (!hasSubCells) fetchCellProducts(cellId);
                    }}
                  >
                    {hasSubCells ? (
                      cell.subCells.map((subCell) => {
                        const subCellStatus =
                          cellStatus[subCell.id] !== undefined
                            ? cellStatus[subCell.id]
                            : 0;
                        const isSubCellSelected = selectedCell === subCell.id;
                        return (
                          <div
                            key={subCell.id}
                            className={`h-16 flex-1 ${getBackgroundColor(
                              subCellStatus,
                              isSubCellSelected,
                              subCell.id
                            )} ${getTextColor(
                              subCellStatus,
                              isSubCellSelected,
                              subCell.id
                            )} border border-gray-200 rounded-sm flex items-center justify-center hover:bg-opacity-75 cursor-pointer`}
                            style={{ width: `${baseColumnWidth / 2}rem` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Clicked SubCell:", subCell.id);
                              handleCellClick(row, col);
                              setSelectedCell(subCell.id);
                              fetchCellProducts(subCell.id);
                            }}
                          >
                            <div className="text-xs">{subCell.id}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className={`flex items-center justify-center h-full w-full ${getTextColor(
                          status,
                          isSelected,
                          cellId
                        )}`}
                      >
                        {col}-{row}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex mt-2 px-2 gap-2" style={{ width: totalWidth }}>
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
          <div className="w-4 h-4 bg-white border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(ว่าง)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#0A8F08] border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(ใช้งาน)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(เต็ม)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 border border-gray-200 rounded-full mr-2"></div>
          <span className="text-sm">(ปิดการใช้งาน)</span>
        </div>
      </div>

      <div className="h-[325px] bg-white border border-black/50 mt-7 mx-auto py-4 px-6 overflow-y-auto">
        <div className="flex items-center">
          <p className="opacity-70 text-black text-lg font-bold">สินค้าใน</p>
          <input
            className="w-[65px] h-[25px] ml-2"
            type="text"
            value={selectedCell || ""}
            readOnly
          />
        </div>

        <div className="px-4 py-4 w-full h-[60px] mb-4 bg-transparent rounded-t-lg">
          <div className="flex items-center justify-between">
            <p className="w-[60px] text-center font-semibold">No</p>
            <p className="w-[120px] text-center font-semibold">ID</p>
            <p className="w-[100px] text-center font-semibold">Type</p>
            <p className="w-[220px] text-center font-semibold">Name</p>
            <p className="w-[100px] text-center font-semibold">Location</p>
            <p className="w-[80px] text-center font-semibold">Quantity</p>
            <p className="w-[100px] text-center font-semibold">In</p>
            <p className="w-[100px] text-center font-semibold">End</p>
            <p className="w-[80px] text-center font-semibold"></p>
          </div>
        </div>

        {loadingTable ? (
          <div className="text-center py-10">
            <Spin tip="กำลังโหลดข้อมูล..." />
          </div>
        ) : productsData.length > 0 ? (
          productsData.map((item) => (
            <div
              key={item.key}
              className="px-4 py-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
            >
              <div className="flex items-center justify-between">
                <div className="w-[60px] text-center">{item.no}</div>
                <div className="w-[120px] text-center">{item.id}</div>
                <div className="w-[100px] text-center">{item.type}</div>
                <div className="w-[220px] flex items-center justify-center text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full mr-2"
                    onError={handleImageError}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="w-[100px] text-center">{item.location}</div>
                <div className="w-[80px] text-center">{item.quantity}</div>
                <div className="w-[100px] text-center">{item.in}</div>
                <div className="w-[100px] text-center">{item.end}</div>
                <div
                  className="w-[80px] text-center cursor-pointer hover:text-blue-500 search-icon"
                  onClick={(e) => handleSearchClick(item, e)}
                >
                  <SearchOutlined className="text-xl" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            ยังไม่มีข้อมูลสินค้า กรุณาคลิกที่ Location เพื่อดูข้อมูล
          </div>
        )}
      </div>

      {isSearchModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal bg-white p-6 rounded-lg shadow-xl w-[450px] max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-[150px] h-[150px] object-contain"
                  onError={handleImageError}
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    Name: {selectedProduct.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {selectedProduct.type}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Location ที่ตั้งสินค้า:</p>
                {otherLocations.length > 0 ? (
                  otherLocations.map((loc, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{loc.location}</span>
                      <span className="text-green-600">
                        จำนวน {loc.quantity} ชิ้น
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    ไม่มีสินค้าในตำแหน่งอื่น
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSearchModalClose}
                  className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLocation;