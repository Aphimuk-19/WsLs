import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Space, Select } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { BASE_URL } from '../config/config';
const { Search } = Input;
const { Option } = Select;

const DEFAULT_IMAGE = "https://placehold.co/40x40?text=No+Image";

// CustomInputNumber คงเดิม
const CustomInputNumber = ({
  value = 0,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

const ProductTransfer = () => {
  const navigate = useNavigate();
  const [requisitionData, setRequisitionData] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequisitionData, setFilteredRequisitionData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false); // เพิ่ม state ควบคุมการแสดง Select

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/cell/cellsAll`);
        const result = await response.json();
        if (result.success) {
          const products = [];
          const typesSet = new Set();

          result.data.forEach((cell, cellIndex) => {
            if (cell.products && cell.products.length > 0) {
              cell.products.forEach((product, productIndex) => {
                const productType = product.product?.type || "N/A";
                typesSet.add(productType);
                products.push({
                  key: `${cell.cellId}-main-${productIndex}`,
                  no: (products.length + 1).toString(),
                  id: product.product?.productId || "N/A",
                  type: productType,
                  name: product.product?.name || "ไม่ระบุชื่อ",
                  image: product.product?.image
                    ? `${BASE_URL}${product.product.image}`
                    : DEFAULT_IMAGE,
                  location: `${cell.col}-${cell.row}`,
                  in: product.inDate || "N/A",
                  end: product.endDate || "N/A",
                  quantity: product.quantity || 0,
                });
              });
            }

            if (cell.subCellsA && cell.subCellsA.products && cell.subCellsA.products.length > 0) {
              cell.subCellsA.products.forEach((product, productIndex) => {
                const productType = product.product?.type || "N/A";
                typesSet.add(productType);
                products.push({
                  key: `${cell.cellId}-subA-${productIndex}`,
                  no: (products.length + 1).toString(),
                  id: product.product?.productId || "N/A",
                  type: productType,
                  name: product.product?.name || "ไม่ระบุชื่อ",
                  image: product.product?.image
                    ? `${BASE_URL}${product.product.image}`
                    : DEFAULT_IMAGE,
                  location: `${cell.col}-${cell.row}-A`,
                  in: product.inDate || "N/A",
                  end: product.endDate || "N/A",
                  quantity: product.quantity || 0,
                });
              });
            }

            if (cell.subCellsB && cell.subCellsB.products && cell.subCellsB.products.length > 0) {
              cell.subCellsB.products.forEach((product, productIndex) => {
                const productType = product.product?.type || "N/A";
                typesSet.add(productType);
                products.push({
                  key: `${cell.cellId}-subB-${productIndex}`,
                  no: (products.length + 1).toString(),
                  id: product.product?.productId || "N/A",
                  type: productType,
                  name: product.product?.name || "ไม่ระบุชื่อ",
                  image: product.product?.image
                    ? `${BASE_URL}${product.product.image}`
                    : DEFAULT_IMAGE,
                  location: `${cell.col}-${cell.row}-B`,
                  in: product.inDate || "N/A",
                  end: product.endDate || "N/A",
                  quantity: product.quantity || 0,
                });
              });
            }
          });

          setRequisitionData(products);
          setFilteredRequisitionData(products);
          setQuantities(products.map(() => 0));
          setProductTypes(Array.from(typesSet));
        } else {
          console.error("ไม่สามารถดึงข้อมูลได้:", result.error);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
    const newQuantities = filtered.map((item, idx) => 
      quantities[requisitionData.findIndex(i => i.key === item.key)] || 0
    );
    setQuantities(newQuantities);
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
    const newQuantities = filtered.map((item) => 
      quantities[requisitionData.findIndex(i => i.key === item.key)] || 0
    );
    setQuantities(newQuantities);
  };

  const handleFilterClick = () => {
    setShowTypeFilter((prev) => !prev); // สลับสถานะการแสดง Select
  };

  const handleConfirm = () => {
    console.log("ยืนยัน:", selectedItems);
    navigate("/tranferproduct", { state: { selectedItems } });
  };

  const handleCancel = () => {
    setSelectedItems([]);
    setQuantities(filteredRequisitionData.map(() => 0));
    setSearchTerm("");
    setSelectedType(null);
    setFilteredRequisitionData(requisitionData);
    setShowTypeFilter(false); // ซ่อน Select เมื่อกดยกเลิก
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex items-center justify-start gap-6 mb-3 w-full ml-[14rem]">
        <div className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1">
          จัดการการย้ายสินค้า
        </div>
      </div>

      <div className="w-[1400px] h-[1px] bg-[#dcdcdc] mb-4"></div>

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
          style={{ width: showTypeFilter ? 900 : 1120 }} // ปรับความกว้างตามการแสดง Select
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
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : requisitionData.length === 0 ? (
          <p className="text-center text-gray-500">ไม่มีสินค้าในระบบ</p>
        ) : (
          <div
            style={{
              maxHeight: "360px",
              overflowY: "auto",
            }}
          >
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-300 h-15">
                  <th className="p-2 text-sm text-center w-[150px]">รหัสสินค้า</th>
                  <th className="p-2 text-sm text-center w-[120px]">หมวดหมู่</th>
                  <th className="p-2 text-sm text-center w-[100px]">รูป</th>
                  <th className="p-2 text-sm text-center w-[200px]">ชื่อสินค้า</th>
                  <th className="p-2 text-sm text-center w-[100px]">ตำแหน่ง</th>
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
                        onError={handleImageError}
                      />
                    </td>
                    <td className="p-2 text-sm text-center">{item.name}</td>
                    <td className="p-2 text-sm text-center">{item.location}</td>
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
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">รายการสินค้าที่เลือก</h1>
            <h1 className="text-lg">
              จำนวน <span>{selectedItems.length}</span> รายการ
            </h1>
          </div>

          {selectedItems.length > 0 ? (
            <div
              style={{
                maxHeight: "288px",
                overflowY: "auto",
              }}
            >
              <table className="table-fixed w-[1400px]">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300 h-15">
                    <th className="p-2 text-sm text-center w-[100px]">รูป</th>
                    <th className="p-2 text-sm text-center w-[250px]">ชื่อสินค้า</th>
                    <th className="p-2 text-sm text-center w-[100px]">ตำแหน่ง</th>
                    <th className="p-2 text-sm text-center w-[100px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => (
                    <tr key={item.key} className="h-12">
                      <td className="p-2 text-sm text-left w-[100px] border-b border-gray-300">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain mx-auto" 
                          onError={handleImageError}
                        />
                      </td>
                      <td className="p-2 text-sm text-left w-[250px] border-b border-gray-300">
                        {item.name}
                        <br />
                        จำนวน {item.requestedQuantity}
                      </td>
                      <td className="p-2 text-sm text-center w-[100px] border-b border-gray-300">
                        {item.location}
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
    </div>
  );
};

export default ProductTransfer;