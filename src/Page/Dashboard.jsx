import React from "react";
import { Layout } from "antd";
import DashboardLocationView from "../Context/DashboardLocationView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const { Content } = Layout;

// ข้อมูลตัวอย่างสำหรับตาราง
const data = [
  {
    key: "1",
    Trackingno: "001",
    ProductName: "ASUS VIVOBOOK",
    Status: "เข้า",
    Amount: "10",
  },
  {
    key: "2",
    Trackingno: "002",
    ProductName: "DELL XPS 13",
    Status: "ออก",
    Amount: "5",
  },
  {
    key: "3",
    Trackingno: "003",
    ProductName: "HP SPECTRE",
    Status: "เข้า",
    Amount: "15",
  },
  {
    key: "4",
    Trackingno: "004",
    ProductName: "LENOVO THINKPAD",
    Status: "ออก",
    Amount: "8",
  },
  {
    key: "5",
    Trackingno: "005",
    ProductName: "MACBOOK PRO",
    Status: "เข้า",
    Amount: "12",
  },
];

const Dashboard = () => {
  return (
    <Content className="mt-10">
      <div className="flex justify-center items-center mt-[16px] gap-6">
        <div className="w-[478px] h-[344px] bg-white rounded-xl p-5">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold">
            สินค้าเข้าแล้วออก
          </h1>
          <div className="flex items-center justify-center space-x-11 mt-[40px]">
            <div>
              <FontAwesomeIcon
                icon={faArrowDown}
                style={{ fontSize: "70px", color: "#1666FA" }}
              />
            </div>
            <div className="flex-col justify-center items-center text-center space-y-1">
              <p className="text-4xl font-bold">250</p>
              <p className="text-lg text-gray-600">จำนวนสินค้าเข้า</p>
            </div>
            <div className="mt-[-75px]">
              <p className="text-black text-[20px] font-bold">IN</p>
            </div>
          </div>
          <div
            style={{
              width: "301px",
              height: "2px",
              backgroundColor: "#000",
              margin: "20px auto",
            }}
          ></div>
          <div className="flex items-center justify-center space-x-11 mt-[30px]">
            <div>
              <FontAwesomeIcon
                icon={faArrowDown}
                style={{
                  fontSize: "70px",
                  color: "#FA161A",
                  transform: "rotate(-180deg)",
                  marginLeft: "17.5px",
                }}
              />
            </div>
            <div className="flex-col justify-center items-center text-center space-y-1">
              <p className="text-4xl font-bold">250</p>
              <p className="text-lg text-gray-600">จำนวนสินค้าออก</p>
            </div>
            <div className="mt-[-65px]">
              <p className="text-black text-[20px] font-bold">OUT</p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="w-[875px] h-[340px] bg-white rounded-xl overflow-hidden">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold pt-5 pl-5">
            5 Recent Orders
          </h1>
          <div className="px-4 w-full">
            {/* Header ของตาราง (ไม่มีเส้นขอบ) */}
            <div className="flex space-x-6 p-4">
              <p className="flex-[2] text-center font-semibold text-[#030229]">
                Tracking No
              </p>
              <p className="flex-[3] text-center font-semibold text-[#030229]">
                Product Name
              </p>
              <p className="flex-[3] text-center font-semibold text-[#030229]">
                Status
              </p>
              <p className="flex-[2] text-center font-semibold text-[#030229]">
                Amount
              </p>
            </div>
            <div
              style={{
                width: "830px",
                height: "1px",
                backgroundColor: "#dcdcdc", // light gray line color
              }}
            ></div>
            <div className="max-h-[240px] overflow-y-auto">
              {data.map((item) => (
                <div
                  key={item.key}
                  className="flex space-x-6  p-3 hover:bg-gray-50"
                >
                  <div className="flex-[2] flex items-center justify-center text-center">
                    {item.Trackingno}
                  </div>
                  <div className="flex-[3] flex items-center justify-center text-center">
                    {item.ProductName}
                  </div>
                  <div className="flex-[3] flex items-center justify-center text-center">
                    <span
                      className={`flex items-center justify-center text-white text-xs font-semibold px-2 py-1 rounded-full truncate ${
                        item.Status === "เข้า" ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: "60px" }}
                    >
                      {item.Status}
                    </span>
                  </div>
                  <div className="flex-[2] flex items-center justify-center text-center">
                    {item.Amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="flex justify-center items-center gap-6 mt-[16px] ">
        <div className="flex justify-center items-center gap-6 mt-[16px]">
          <div className="w-[875px] bg-white rounded-[10px] flex flex-col justify-center items-center p-4">
            <DashboardLocationView />
            <div className="flex items-center justify-start mt-2 space-x-10 ml-[20px] mr-auto">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-200 rounded-full mr-2"></div>
                <span className="text-sm">(ว่าง)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 border border-gray-200 rounded-full mr-2"></div>
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
          </div>
        </div>
        <div className="w-[478px] h-[343px] bg-white rounded-[10px]">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold p-5">
            พื้นที่เก็บสินค้า
          </h1>
        </div>
      </div>
    </Content>
  );
};

export default Dashboard;
