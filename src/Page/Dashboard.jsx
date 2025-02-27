import React from "react";
import { Layout } from "antd"; // Import Layout component
import DashboardLocationView from "../Context/DashboardLocationView"; // Import DashboardLocationView component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"; // ใช้ FontAwesome ไอคอนลูกศร

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Content className="mt-10">
      <div className="flex justify-center items-center mt-[16px] gap-6">
        <div className="w-[478px] h-[344px] bg-white rounded-xl p-5">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold ">
            สินค้าเข้าแล้วออก
          </h1>
          <div className="flex items-center justify-center space-x-11 mt-[40px]">
            {/* ลูกศร FontAwesome */}
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
              <p className="text-black text-[20px] font-bold" >IN</p>
            </div>
          </div>
          <div
            style={{
              width: "301px",
              height: "2px",
              backgroundColor: "#000", // light gray line color
              margin: "20px auto", // Center the line horizontally
            }}
          ></div>
          <div className="flex items-center justify-center space-x-11 mt-[30px]">
            {/* ลูกศร FontAwesome หมุนขึ้น */}
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
              <p className="text-black text-[20px] font-bold ">OUT</p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="w-[875px] h-[340px] bg-white rounded-xl">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold p-5 ">
            5 Recent Orders
          </h1>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="flex justify-center items-center gap-6 mt-[16px]">
        <div className="w-[875px] h-[343px] bg-white rounded-[10px]">
          <DashboardLocationView />
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
