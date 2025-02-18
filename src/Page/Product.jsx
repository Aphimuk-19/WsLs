import React, { useState } from "react";
import { Input, Button, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const data = [
  {
    key: "1",
    no: "1",
    id: "#876364",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20250208100449_74256_436_1.jpg?v=742561738984366",
    location: "A1C3",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 15, // จำนวน
  },
  {
    key: "2",
    no: "2",
    id: "#876365",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20250208100449_74256_436_1.jpg?v=742561738984366",
    location: "A1C3",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 5, // จำนวน
  },
  {
    key: "3",
    no: "3",
    id: "#876366",
    type: "Notebook",
    name: "ASUS VIVOBOOK",
    image:
      "https://www.jib.co.th/img_master/product/medium/20250208100449_74256_436_1.jpg?v=742561738984366",
    location: "A1C3",
    in: "01/01/68",
    end: "01/01/70",
    quantity: 0, // จำนวน
  },
];

const Product = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [filterStatus, setFilterStatus] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleFilter = () => {
    const filtered = data.filter((item) => item.status === filterStatus);
    setFilteredData(filtered);
  };

  const getStatusTag = (quantity) => {
    if (quantity === 0) {
      return <Tag color="red">Out</Tag>; // If quantity is 0, show "Out" with red color
    } else if (quantity < 10) {
      return <Tag color="yellow">Low</Tag>; // If quantity is less than 10, show "Low" with yellow color
    } else {
      return <Tag color="green">Active</Tag>; // Otherwise, show "Active" with green color
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="space-y-5 p-4 w-full max-w-7xl">
        {/* Search Input and Filter Button - Align Search to the Right */}
        <div className="flex justify-end space-x-4 mb-6">
          <Input
            style={{ width: "230px" }} // Inline style for width of input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name or ID"
            prefix={<SearchOutlined />}
          />
          <Button
            onClick={handleFilter}
            style={{
              backgroundColor: "#fff",
              width: "90px",
              height: "40px",
              color: "black",
              padding: "6px 16px",
              borderRadius: "7px",
              fontSize: "14px",
            }} // Inline style for the button
            size="small" // Reduces the button size
          >
            Filter
          </Button>
        </div>

        {/* Table Header */}
<div className="px-4 p-4 w-full h-[60px] mb-4">
  <div className="flex gap-6">
    <p className="w-[100px] flex items-center justify-center text-center">No</p>
    <p className="w-[150px] flex items-center justify-center text-center">ID</p>
    <p className="w-[120px] flex items-center justify-center text-center">Type</p>
    <p className="w-[200px] flex items-center justify-center text-center">Name</p>
    <p className="w-[130px] flex items-center justify-center text-center">Location</p>
    <p className="w-[120px] flex items-center justify-center text-center">In</p>
    <p className="w-[120px] flex items-center justify-center text-center">End</p>
    <p className="w-[150px] flex items-center justify-center text-center">Status</p>
  </div>
</div>

{/* Data Table */}
{filteredData.map((item) => (
  <div
    key={item.key}
    className="px-4 p-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
  >
    <div className="flex gap-6"> {/* ใช้ gap-6 เพื่อเพิ่มระยะห่างระหว่างคอลัมน์ */}
      <div className="w-[100px] flex items-center justify-center text-center">
        {item.no}
      </div>
      <div className="w-[150px] flex items-center justify-center text-center">
        {item.id}
      </div>
      <div className="w-[120px] flex items-center justify-center text-center">
        {item.type}
      </div>
      <div className="w-[200px] flex items-center justify-center text-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 rounded-full mr-2"
        />
        {item.name}
      </div>
      <div className="w-[130px] flex items-center justify-center text-center">
        {item.location}
      </div>
      <div className="w-[120px] flex items-center justify-center text-center">
        {item.in}
      </div>
      <div className="w-[120px] flex items-center justify-center text-center">
        {item.end}
      </div>
      <div className="w-[150px] flex items-center justify-center text-center">
        {getStatusTag(item.quantity)} {/* แสดงสถานะตามจำนวน */}
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default Product;
