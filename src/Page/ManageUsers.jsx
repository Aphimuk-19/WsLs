import React, { useState } from "react";
import { Input, Button, Tag, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DeleteFilled } from "@ant-design/icons";

const data = [
  {
    key: "1",
    id: "#876364",
    name: "aphimuk.mon",
    image:
      "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "aphimuk.mon",
    type: "admin",
    status: "Active",
  },
  {
    key: "2", // Adding the key property for consistency
    id: "#876365",
    name: "aphimuk.mon",
    image:
      "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "aphimuk.mon",
    type: "user",
    status: "Inactive",
  },
  {
    key: "3",
    id: "#876366",
    name: "aphimuk.mon",
    image:
      "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    Email: "jane.smith",
    type: "admin",
    status: "Active",
  },
];

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedItems, setSelectedItems] = useState({});

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

  const handleCheckboxChange = (key) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [key]: !prevSelected[key], // Toggle selection
    }));
  };

  const handleDelete = (key) => {
    const filtered = filteredData.filter((item) => item.key !== key);
    setFilteredData(filtered);
  };

  const handleTypeChange = (key, value) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, type: value } : item
      )
    );
  };

  const getStatusTag = (status) => {
    return (
      <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="space-y-5 p-4 w-full max-w-7xl">
        {/* Search Input */}
        <div className="flex justify-end space-x-4 mb-6">
          <Input
            style={{ width: "230px" }}
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name or ID"
            prefix={<SearchOutlined />}
          />
        </div>

        {/* Table Header */}
        <div className="px-4 p-4 w-full h-[60px] mb-4 ">
          <div className="flex space-x-6">
            <p className="flex-[1] text-center">Select</p>
            <p className="flex-[2] text-center">ID</p>
            <p className="flex-[3] text-center">Name</p>
            <p className="flex-[3] text-center">Email</p>
            <p className="flex-[2] text-center">Type</p>
            <p className="flex-[2] text-center">Status</p>
            <p className="flex-[1] text-center">
              <DeleteFilled />
            </p>
          </div>
        </div>

        {/* Data Table */}
        {filteredData.map((item) => (
          <div
            key={item.key}
            className="px-4 p-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
          >
            <div className="flex space-x-6">
              {/* Checkbox column */}
              <div className="flex-[1] flex items-center justify-center text-center">
                <input
                  type="checkbox"
                  checked={selectedItems[item.key] || false}
                  onChange={() => handleCheckboxChange(item.key)}
                />
              </div>
              <div className="flex-[2] flex items-center justify-center text-center">
                {item.id}
              </div>
              <div className="flex-[3] flex items-center justify-center text-center">
                <div className="flex items-center justify-start text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full mr-2"
                    style={{ objectFit: "cover" }} // Ensures image doesn't stretch
                  />
                  <span>{item.name}</span>
                </div>
              </div>
              <div className="flex-[3] flex items-center justify-center text-center">
                {item.Email}
              </div>
              <div className="flex-[2] flex items-center justify-center text-center">
                <Select
                  value={item.type}
                  onChange={(value) => handleTypeChange(item.key, value)}
                  style={{ width: "100px" }} // Reduced size
                  size="small" // Make the Select component smaller
                >
                  <Select.Option
                    value="admin"
                    className="admin-option"
                  >
                    Admin
                  </Select.Option>
                  <Select.Option
                    value="user"
                    className="user-option"
                  >
                    User
                  </Select.Option>
                </Select>
              </div>
              <div className="flex-[2] flex items-center justify-center text-center">
                {getStatusTag(item.status)}
              </div>
              <div className="flex-[1] flex items-center justify-center text-center">
                ...
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
