import React, { useState } from "react";
import { Button, Input, Space, Table, message } from "antd";
import { SearchOutlined, FilterOutlined, CopyOutlined } from "@ant-design/icons";
const { Search } = Input;

const ProductEntryTab = ({ productEntryData, entrySearchValue, setEntrySearchValue, filteredEntryData, setFilteredEntryData }) => {
  const [isEntryFilterOpen, setIsEntryFilterOpen] = useState(false);

  const handleEntrySearch = (value) => {
    setEntrySearchValue(value);
    if (value) {
      const filtered = productEntryData.filter((item) =>
        item.products.some((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredEntryData(filtered);
    } else {
      setFilteredEntryData([]);
    }
  };

  const handleEntryFilterClick = () => {
    setIsEntryFilterOpen(!isEntryFilterOpen);
    console.log("Entry Filter toggled:", !isEntryFilterOpen);
  };

  const handleEntryCopy = (record) => {
    const textToCopy = `
      หมายเลขการเข้า: ${record.entryNumber}
      วันที่: ${record.date}
      สินค้า: ${record.products.map((p) => `${p.name} (จำนวน: ${p.quantity})`).join(", ")}
    `;
    navigator.clipboard.writeText(textToCopy).then(() => {
      message.success("คัดลอกข้อมูลสำเร็จ!");
    }).catch(() => {
      message.error("ไม่สามารถคัดลอกข้อมูลได้");
    });
  };

  const entryColumns = [
    { title: "หมายเลขการเข้า", dataIndex: "entryNumber", key: "entryNumber" },
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
          onClick={() => handleEntryCopy(record)}
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
          onSearch={handleEntrySearch}
          onChange={(e) => handleEntrySearch(e.target.value)}
          style={{ width: 1120 }}
        />
        <Button
          icon={<FilterOutlined />}
          onClick={handleEntryFilterClick}
          type="primary"
          style={{ backgroundColor: "#006ec4", borderColor: "#006ec4", width: 232 }}
        >
          ตัวกรอง
        </Button>
      </Space>

      <div className="w-[1400px]">
        <Table
          dataSource={entrySearchValue ? filteredEntryData : productEntryData}
          columns={entryColumns}
          pagination={false}
          bordered
        />
      </div>
    </>
  );
};

export default ProductEntryTab;