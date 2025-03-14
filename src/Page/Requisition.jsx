import React, { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedQuantities, setSelectedQuantities] = useState(
    data.reduce((acc, item) => ({ ...acc, [item.key]: 0 }), {})
  );

  const handleIncrement = (key) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  const handleDecrement = (key) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] - 1),
    }));
  };

  const handleInputChange = (key, value) => {
    const newValue = value === "" ? 0 : parseInt(value);
    if (!isNaN(newValue)) {
      setSelectedQuantities((prev) => ({
        ...prev,
        [key]: Math.max(0, newValue),
      }));
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="space-y-5 p-4 w-full max-w-7xl">
        {/* Search Input and Filter Button */}
        <div className="flex justify-end space-x-4 mb-6">
          <Input
            style={{ width: "230px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID"
            prefix={<SearchOutlined />}
          />
          <Button
            style={{
              backgroundColor: "#fff",
              width: "130px",
              height: "40px",
              color: "black",
              padding: "6px 16px",
              borderRadius: "7px",
              fontSize: "14px",
            }}
            size="small"
          >
            Enter requisition
          </Button>
        </div>

        {/* Table Header */}
        <div className="px-4 p-4 w-full h-[60px] mb-4">
          <div className="flex gap-6">
            <p className="w-[150px] flex items-center justify-center text-center font-semibold">
              ID
            </p>
            <p className="w-[120px] flex items-center justify-center text-center font-semibold">
              Type
            </p>
            <p className="w-[200px] flex items-center justify-center text-center font-semibold">
              Name
            </p>
            <p className="w-[130px] flex items-center justify-center text-center font-semibold">
              Location
            </p>
            <p className="w-[120px] flex items-center justify-center text-center font-semibold">
              Inventory
            </p>
            <p className="w-[120px] flex items-center justify-center text-center font-semibold">
              Amount
            </p>
            <p className="w-[150px] flex items-center justify-center text-center font-semibold">
              Action
            </p>
          </div>
        </div>

        {/* Data Table */}
        {filteredData.map((item) => (
          <div
            key={item.key}
            className="px-4 p-4 w-full h-[70px] mb-4 bg-white rounded-[13.05px] shadow-[1.3054757118225098px_22.193086624145508px_57.4409294128418px_0px_rgba(3,2,41,0.07)]"
          >
            <div className="flex gap-6">
              <div className="w-[150px] flex items-center justify-center text-center">
                {item.id}
              </div>
              <div className="w-[120px] flex items-center justify-center text-center">
                {item.type}
              </div>
              <div className="w-[200px] flex items-center justify-center text-center">
                <div className="flex items-center justify-center space-x-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{item.name}</span>
                </div>
              </div>
              <div className="w-[130px] flex items-center justify-center text-center">
                {item.location}
              </div>
              <div className="w-[120px] flex items-center justify-center text-center">
                {item.quantity}
              </div>
              <div className="w-[120px] flex items-center justify-center text-center">
                <div className="flex items-center justify-center w-full h-full">
                  <div className="flex items-center justify-between bg-gray-50 rounded-full w-24 px-2 py-1">
                    <button
                      onClick={() => handleDecrement(item.key)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-blue-600 shadow-sm border border-gray-100 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                      aria-label="ลดจำนวน"
                    >
                      <span className="text-base font-medium">−</span>
                    </button>

                    <input
                      type="text"
                      value={selectedQuantities[item.key]}
                      onChange={(e) => handleInputChange(item.key, e.target.value)}
                      className="w-8 h-7 text-center font-medium text-base text-gray-800 bg-transparent focus:outline-none"
                      aria-label="จำนวน"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <button
                      onClick={() => handleIncrement(item.key)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-blue-600 shadow-sm border border-gray-100 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                      aria-label="เพิ่มจำนวน"
                    >
                      <span className="text-base font-medium">+</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-[150px] flex items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">+</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="w-[1250px] h-[327px] bg-[#f0f1f9]/60 rounded-[14px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">

      </div>
      </div>
      
    </div>
  );
};

export default Requisition;