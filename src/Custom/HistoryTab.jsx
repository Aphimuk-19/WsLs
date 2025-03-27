import React, { useState } from "react";
import { Button, Input, Space, Table, message } from "antd";
import { SearchOutlined, FilterOutlined, CopyOutlined } from "@ant-design/icons";
const { Search } = Input;

const HistoryTab = ({ historyData, historySearchValue, setHistorySearchValue, filteredHistoryData, setFilteredHistoryData }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  );
};

export default HistoryTab;