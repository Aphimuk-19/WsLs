import React, { useState } from "react";
import { Button, Input, Space, Table, message } from "antd";
import { SearchOutlined, FilterOutlined, CopyOutlined } from "@ant-design/icons";
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

const Requisition = () => {
  const [activeTab, setActiveTab] = useState("requisition"); // State to track active tab

  // Data for Requisition
  const requisitionData = [
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

  // Data for History
  const historyData = [
    {
      key: "1",
      requisitionNumber: "846065",
      date: "1/มีนา/2567",
      products: [
        { name: "ASUS VIVOBOOK", quantity: 10 },
        { name: "ACER ASPIRE 3", quantity: 2 },
      ],
    },
    {
      key: "2",
      requisitionNumber: "846075",
      date: "1/มีนา/2567",
      products: [{ name: "ACER ASPIRE 3", quantity: 5 }],
    },
    {
      key: "3",
      requisitionNumber: "846085",
      date: "1/มีนา/2567",
      products: [
        { name: "ASUS VIVOBOOK", quantity: 1 },
        { name: "ACER ASPIRE 3", quantity: 2 },
      ],
    },
  ];

  // Requisition State
  const [quantities, setQuantities] = useState(requisitionData.map(() => 0));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequisitionData, setFilteredRequisitionData] = useState(requisitionData);
  const [selectedItems, setSelectedItems] = useState([]);

  // History State
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Requisition Logic
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
        const existingIndex = prev.findIndex((i) => i.id === item.id);
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

  const handleDeleteItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleRequisitionSearch = (value) => {
    setSearchTerm(value);
    const filtered = requisitionData.filter(
      (item) =>
        item.id.toLowerCase().includes(value.toLowerCase()) ||
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.type.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRequisitionData(filtered);
  };

  const handleFilterClick = () => {
    console.log("Filter button clicked");
  };

  const handleConfirm = () => {
    console.log("ยืนยัน:", selectedItems);
  };

  const handleCancel = () => {
    setSelectedItems([]);
    setQuantities(requisitionData.map(() => 0));
    console.log("ยกเลิก");
  };

  // History Logic
  const handleHistorySearch = (value) => {
    setHistorySearchValue(value);
    if (value) {
      const filtered = historyData.filter((item) =>
        item.products.some((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredHistoryData(filtered);
    } else {
      setFilteredHistoryData([]);
    }
  };

  const handleHistoryFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
    console.log("Filter toggled:", !isFilterOpen);
  };

  const handleCopy = (record) => {
    const textToCopy = `
      หมายเลขใบเบิก: ${record.requisitionNumber}
      วันที่: ${record.date}
      สินค้า: ${record.products.map((p) => `${p.name} (จำนวน: ${p.quantity})`).join(", ")}
    `;
    navigator.clipboard.writeText(textToCopy).then(() => {
      message.success("คัดลอกข้อมูลสำเร็จ!");
    }).catch(() => {
      message.error("ไม่สามารถคัดลอกข้อมูลได้");
    });
  };

  const historyColumns = [
    { title: "หมายเลขใบเบิก", dataIndex: "requisitionNumber", key: "requisitionNumber" },
    { title: "วันที่", dataIndex: "date", key: "date" },
    {
      title: "สินค้า",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <div>
          {products.map((product, index) => (
            <div key={index}>
              {product.name} (จำนวน: {product.quantity})
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <CopyOutlined
          onClick={() => handleCopy(record)}
          style={{ cursor: "pointer", fontSize: "16px", color: "#1890ff" }}
        />
      ),
      width: 50,
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex items-center justify-start gap-6 mb-3 w-full ml-[14rem]">
        <button
          onClick={() => setActiveTab("requisition")}
          className={`text-xl font-bold ${
            activeTab === "requisition"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          เบิกสินค้า
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`text-xl font-bold ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          ประวัติการเบิก
        </button>
      </div>

      <div className="w-[1400px] h-[1px] bg-[#dcdcdc] mb-4"></div>

      {/* Requisition Content */}
      {activeTab === "requisition" && (
        <>
          <Space direction="horizontal" style={{ marginBottom: 16, display: "flex", gap: 35 }}>
            <Search
              placeholder="ค้นหาสินค้า..."
              allowClear
              enterButton={<Button icon={<SearchOutlined />} />}
              onSearch={handleRequisitionSearch}
              onChange={(e) => handleRequisitionSearch(e.target.value)}
              style={{ width: 1120 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={handleFilterClick}
              type="primary"
              style={{ backgroundColor: "#006ec4", borderColor: "#006ec4", width: 232 }}
            >
              ตัวกรอง
            </Button>
          </Space>

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
                {filteredRequisitionData.map((item, index) => (
                  <tr key={item.key} className="border-b border-gray-300 hover:bg-gray-50 h-15">
                    <td className="p-2 text-sm text-center">{item.id}</td>
                    <td className="p-2 text-sm text-center">{item.type}</td>
                    <td className="p-2 text-sm text-center">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full mx-auto" />
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
                        style={{ backgroundColor: "#3A974C", borderColor: "#52c41a" }}
                        onClick={() => handleAddItem(index)}
                      >
                        เพิ่ม
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold">รายการสินค้าที่เลือก</h1>
                <h1 className="text-lg">
                  จำนวน <span>{selectedItems.length}</span> รายการ
                </h1>
              </div>

              {selectedItems.length > 0 ? (
                <table className="table-fixed w-[1400px]">
                  <tbody>
                    {selectedItems.map((item) => (
                      <tr key={item.key} className="h-12">
                        <td className="p-2 text-sm text-left w-[100px] border-b border-gray-300">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md mx-auto" />
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
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            ลบ
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                style={{ width: 100, backgroundColor: "#006ec4", borderColor: "#006ec4", color: "#fff" }}
                disabled={selectedItems.length === 0}
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </>
      )}

      {/* History Content */}
      {activeTab === "history" && (
        <>
          <Space direction="horizontal" style={{ marginBottom: 16, display: "flex", gap: 35 }}>
            <Search
              placeholder="ค้นหาสินค้า..."
              allowClear
              enterButton={<Button icon={<SearchOutlined />} />}
              onSearch={handleHistorySearch}
              onChange={(e) => handleHistorySearch(e.target.value)}
              style={{ width: 1120 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={handleHistoryFilterClick}
              type="primary"
              style={{ backgroundColor: "#006ec4", borderColor: "#006ec4", width: 232 }}
            >
              ตัวกรอง
            </Button>
          </Space>

          <div className="w-[1400px]">
            <Table
              dataSource={historySearchValue ? filteredHistoryData : historyData}
              columns={historyColumns}
              pagination={false}
              bordered
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Requisition;