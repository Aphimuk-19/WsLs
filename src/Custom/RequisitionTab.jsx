import React, { useState, useEffect } from "react";
import { Button, Input, Space, message, Select } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../config/config';

const { Search } = Input;
const { Option } = Select; // Fixed the syntax here

// CustomInputNumber component (unchanged)
const CustomInputNumber = ({
  value = 0,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  const [inputValue, setInputValue] = React.useState(value);

  const handleIncrement = () => {
    if (inputValue < max) {
      const newValue = inputValue + 1;
      setInputValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (inputValue > min) {
      const newValue = inputValue - 1;
      setInputValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      setInputValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <div className="flex items-center w-[80px] h-[30px] border border-gray-300 rounded-md overflow-hidden mx-auto">
      <button
        onClick={handleDecrement}
        className="w-[25px] h-full flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
      >
        -
      </button>
      <input
        value={inputValue}
        onChange={handleChange}
        className="w-[30px] h-full text-center border-none focus:outline-none"
        type="number"
      />
      <button
        onClick={handleIncrement}
        className="w-[25px] h-full flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
      >
        +
      </button>
    </div>
  );
};

const RequisitionTab = () => {
  const [requisitionData, setRequisitionData] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequisitionData, setFilteredRequisitionData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token)
          throw new Error("No authentication token found. Please log in.");

        const response = await fetch(`${BASE_URL}/api/cell/cellsAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (!data.success)
          throw new Error(
            data.message || "API returned an unsuccessful response"
          );

        const cells = Array.isArray(data.data) ? data.data : [];
        const formattedData = cells.flatMap((cell) => {
          const products = [];
          const typesSet = new Set();

          if (
            cell.divisionType !== "dual" &&
            cell.products &&
            Array.isArray(cell.products)
          ) {
            cell.products.forEach((product) => {
              const productType = product.product.type || "Unknown";
              typesSet.add(productType);
              products.push({
                key: `${cell.cellId}-${product.product.productId}`,
                id: product.product.productId,
                cellId: cell.cellId,
                type: productType,
                name: product.product.name || "Unknown",
                image: product.product.image?.startsWith("http")
                  ? product.product.image
                  : `${BASE_URL}${product.product.image || ""}`,
                quantity: product.quantity || 0,
              });
            });
          }
          if (cell.divisionType === "dual") {
            if (
              cell.subCellsA &&
              cell.subCellsA.products &&
              Array.isArray(cell.subCellsA.products)
            ) {
              cell.subCellsA.products.forEach((product) => {
                const productType = product.product.type || "Unknown";
                typesSet.add(productType);
                products.push({
                  key: `${cell.cellId}-A-${product.product.productId}`,
                  id: product.product.productId,
                  cellId: `${cell.cellId}-A`,
                  type: productType,
                  name: product.product.name || "Unknown",
                  image: product.product.image?.startsWith("http")
                    ? product.product.image
                    : `${BASE_URL}${product.product.image || ""}`,
                  quantity: product.quantity || 0,
                });
              });
            }
            if (
              cell.subCellsB &&
              cell.subCellsB.products &&
              Array.isArray(cell.subCellsB.products)
            ) {
              cell.subCellsB.products.forEach((product) => {
                const productType = product.product.type || "Unknown";
                typesSet.add(productType);
                products.push({
                  key: `${cell.cellId}-B-${product.product.productId}`,
                  id: product.product.productId,
                  cellId: `${cell.cellId}-B`,
                  type: productType,
                  name: product.product.name || "Unknown",
                  image: product.product.image?.startsWith("http")
                    ? product.product.image
                    : `${BASE_URL}${product.product.image || ""}`,
                  quantity: product.quantity || 0,
                });
              });
            }
          }
          setProductTypes(Array.from(typesSet));
          return products;
        });

        setRequisitionData(formattedData);
        setFilteredRequisitionData(formattedData);
        setQuantities(formattedData.map(() => 0));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requisition data:", error.message);
        setLoading(false);
        setRequisitionData([]);
        setFilteredRequisitionData([]);
        setQuantities([]);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleAddItem = (index) => {
    const item = filteredRequisitionData[index];
    const quantity = quantities[index];
    if (quantity > 0) {
      const newSelectedItem = { ...item, requestedQuantity: quantity };
      setSelectedItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.key === item.key);
        if (existingIndex >= 0) {
          const newItems = [...prev];
          newItems[existingIndex].requestedQuantity = quantity;
          return newItems;
        }
        return [...prev, newSelectedItem];
      });
      handleQuantityChange(index, 0);
    }
  };

  const handleDeleteItem = (itemKey) => {
    setSelectedItems((prev) => prev.filter((item) => item.key !== itemKey));
  };

  const handleRequisitionSearch = (value) => {
    setSearchTerm(value);
    const filtered = requisitionData.filter(
      (item) =>
        (item.id.toLowerCase().includes(value.toLowerCase()) ||
         item.name.toLowerCase().includes(value.toLowerCase()) ||
         item.type.toLowerCase().includes(value.toLowerCase())) &&
        (!selectedType || item.type === selectedType)
    );
    setFilteredRequisitionData(filtered);
    setQuantities(filtered.map(() => 0));
  };

  const handleTypeFilter = (value) => {
    setSelectedType(value);
    const filtered = requisitionData.filter(
      (item) =>
        (item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!value || item.type === value)
    );
    setFilteredRequisitionData(filtered);
    setQuantities(filtered.map(() => 0));
  };

  const handleFilterClick = () => {
    setShowTypeFilter((prev) => !prev);
  };

  const handleConfirm = async () => {
    if (selectedItems.length === 0) return;

    const payload = {
      withdrawals: selectedItems.map((item) => ({
        cellId: item.cellId,
        productId: item.id,
        quantity: item.requestedQuantity,
      })),
    };

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found in localStorage");
      message.error("กรุณาล็อกอินใหม่เพื่อดำเนินการต่อ");
      return;
    }

    try {
      console.log(
        "Sending payload to /api/withdraw/withdraw:",
        JSON.stringify(payload)
      );
      const response = await fetch(`${BASE_URL}/api/withdraw/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Withdraw successful:", result);
        const pdfUrl = `${BASE_URL}${result.data.pdfUrl}`;

        const withdrawnItemsMessage = selectedItems
          .map((item) => `${item.name} จำนวน ${item.requestedQuantity}`)
          .join(", ");
        message.success({
          content: `เบิกสินค้าสำเร็จ! รายการที่ตัดออก: ${withdrawnItemsMessage}`,
          duration: 5,
        });

        setSelectedItems([]);
        setQuantities(requisitionData.map(() => 0));
        window.open(pdfUrl, "_blank");
        window.location.reload();
      } else {
        console.error("Withdraw failed:", result);
        message.error(
          `เกิดข้อผิดพลาด: ${result.message || "ไม่สามารถดำเนินการได้"}`
        );
      }
    } catch (error) {
      console.error("Error during withdraw:", error.message);
      message.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setSelectedItems([]);
    setQuantities(requisitionData.map(() => 0));
    setSearchTerm("");
    setSelectedType(null);
    setFilteredRequisitionData(requisitionData);
    setShowTypeFilter(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Space
        direction="horizontal"
        style={{ marginBottom: 16, display: "flex", gap: 35 }}
      >
        <Search
          placeholder="ค้นหาสินค้า..."
          allowClear
          enterButton={<Button icon={<SearchOutlined />} />}
          onSearch={handleRequisitionSearch}
          onChange={(e) => handleRequisitionSearch(e.target.value)}
          style={{ width: showTypeFilter ? 900 : 1120 }}
        />
        {showTypeFilter && (
          <Select
            placeholder="เลือกประเภทสินค้า"
            style={{ width: 200 }}
            onChange={handleTypeFilter}
            value={selectedType}
            allowClear
          >
            {productTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        )}
        <Button
          icon={<FilterOutlined />}
          onClick={handleFilterClick}
          type="primary"
          style={{
            backgroundColor: "#006ec4",
            borderColor: "#006ec4",
            width: 232,
          }}
        >
          ตัวกรอง
        </Button>
      </Space>

      <div className="w-full max-w-[1400px]">
        <div className="max-h-[360px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-300 h-15">
                <th className="p-2 text-sm text-center w-[150px]">
                  รหัสสินค้า
                </th>
                <th className="p-2 text-sm text-center w-[120px]">หมวดหมู่</th>
                <th className="p-2 text-sm text-center w-[100px]">รูป</th>
                <th className="p-2 text-sm text-center w-[200px]">
                  ชื่อสินค้า
                </th>
                <th className="p-2 text-sm text-center w-[100px]">คงเหลือ</th>
                <th className="p-2 text-sm text-center w-[120px]">จำนวน</th>
                <th className="p-2 text-sm text-center w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitionData.map((item, index) => (
                <tr
                  key={item.key}
                  className="border-b border-gray-300 hover:bg-gray-50 h-15"
                >
                  <td className="p-2 text-sm text-center">{item.id}</td>
                  <td className="p-2 text-sm text-center">{item.type}</td>
                  <td className="p-2 text-sm text-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain mx-auto" 
                    />
                  </td>
                  <td className="p-2 text-sm text-center">{item.name}</td>
                  <td className="p-2 text-sm text-center">{item.quantity}</td>
                  <td className="p-2 text-sm text-center">
                    <CustomInputNumber
                      value={quantities[index]}
                      onChange={(value) => handleQuantityChange(index, value)}
                      min={0}
                      max={item.quantity}
                    />
                  </td>
                  <td className="p-2 text-sm text-center">
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#3A974C",
                        borderColor: "#52c41a",
                      }}
                      onClick={() => handleAddItem(index)}
                    >
                      เพิ่ม
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">รายการสินค้าที่เลือก</h1>
            <h1 className="text-lg">
              จำนวน <span>{selectedItems.length}</span> รายการ
            </h1>
          </div>

          {selectedItems.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto">
              <table className="table-fixed w-[1400px]">
                <tbody>
                  {selectedItems.map((item) => (
                    <tr key={item.key} className="h-12">
                      <td className="p-2 text-sm text-left w-[100px] border-b border-gray-300">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain mx-auto"
                        />
                      </td>
                      <td className="p-2 text-sm text-left w-[250px] border-b border-gray-300">
                        {item.name}
                        <br />
                        จำนวน {item.requestedQuantity}
                      </td>
                      <td className="p-2 text-sm text-right w-[290px] border-b border-gray-300 pr-13">
                        <Button
                          type="link"
                          style={{ color: "#f5222d" }}
                          className="hover:text-red-700 p-0"
                          onClick={() => handleDeleteItem(item.key)}
                        >
                          ลบ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">ยังไม่มีสินค้าที่เลือก</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={handleCancel}
            style={{ width: 100, borderColor: "#000", color: "#000" }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            style={{
              width: 100,
              backgroundColor: "#006ec4",
              borderColor: "#006ec4",
              color: "#fff",
            }}
            disabled={selectedItems.length === 0}
          >
            ยืนยัน
          </Button>
        </div>
      </div>
    </>
  );
};

export default RequisitionTab;