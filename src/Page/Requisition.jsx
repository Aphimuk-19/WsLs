import React, { useState } from "react";
import { Button, Input, Space } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
const { Search } = Input;

// CustomInputNumber component (unchanged)
const CustomInputNumber = ({
  value = 0,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  const [inputValue, setInputValue] = useState(value);

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

// Sample data (unchanged)
const data = [
  {
    key: "1",
    no: "1",
    id: "#876364",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20240409150821_66703_287_1.jpg?v=667031724752095",
    location: "04-A",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 15,
  },
  {
    key: "2",
    no: "2",
    id: "#876365",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20240409150821_66703_287_1.jpg?v=667031724752095",
    location: "04-A",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 5,
  },
  {
    key: "3",
    no: "3",
    id: "#876366",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20240409150821_66703_287_1.jpg?v=667031724752095",
    location: "A1",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 0,
  },
];

const Requisition = () => {
  const [quantities, setQuantities] = useState(data.map(() => 0));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = data.filter(
      (item) =>
        item.id.toLowerCase().includes(value.toLowerCase()) ||
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.type.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleFilterClick = () => {
    console.log("Filter button clicked");
    // Add your filter logic here when needed
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      {/* Header section */}
      <div className="flex items-center justify-start gap-6 mb-3 w-full ml-[14rem]">
        <h1 className="text-xl font-bold">เบิกสินค้า</h1>
        <h1 className="text-xl font-bold">ประวัติการเบิก</h1>
      </div>

      {/* Divider */}
      <div className="w-[1400px] h-[1px] bg-[#dcdcdc] mb-4"></div>

      {/* Search and Filter section */}
      <Space
        direction="horizontal"
        style={{ marginBottom: 16, display: "flex", gap: 35 }}
      >
        <Search
          placeholder="ค้นหาสินค้า..."
          allowClear
          enterButton={<Button icon={<SearchOutlined />} />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: 1120,
          }}
        />
        <Button
          icon={<FilterOutlined />}
          onClick={handleFilterClick}
          type="primary"
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            width: 232,
          }}
        >
          ตัวกรอง
        </Button>
      </Space>

      {/* Table */}
      <div className="w-full max-w-[1400px]">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300 h-15">
              <th className="p-2 text-sm text-center w-[150px]">รหัสสินค้า</th>
              <th className="p-2 text-sm text-center w-[120px]">หมวดหมู่</th>
              <th className="p-2 text-sm text-center w-[100px]">รูป</th>
              <th className="p-2 text-sm text-center w-[200px]">ชื่อสินค้า</th>
              <th className="p-2 text-sm text-center w-[100px]">คงเหลือ</th>
              <th className="p-2 text-sm text-center w-[120px]">จำนวน</th>
              <th className="p-2 text-sm text-center w-[100px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
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
                    className="w-10 h-10 rounded-full mx-auto"
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
                    onClick={() =>
                      handleQuantityChange(index, quantities[index])
                    }
                  >
                    เพิ่ม
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-row justify-between  min-h-screen p-4">
          <h1>รายการสินค้าที่เลือก</h1>
          <h1>
            จำนวน <span>2</span> รายการ
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Requisition;
