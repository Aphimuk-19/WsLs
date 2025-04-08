import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import DashboardLocationView from "../Context/DashboardLocationView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BASE_URL } from '../config/config'; // Add this import

ChartJS.register(ArcElement, Tooltip, Legend);

const { Content } = Layout;

const chartOptions = {
  plugins: {
    legend: {
      position: "bottom",
      align: "center",
      labels: {
        font: {
          size: 11,
        },
        pointStyle: "circle",
        boxWidth: 10,
        padding: 10,
        usePointStyle: true,
        filter: (legendItem, chartData) => {
          return chartData.datasets[0].backgroundColor[legendItem.index] !== "#FFFFFF";
        },
      },
    },
  },
  cutout: "70%",
  maintainAspectRatio: false,
};

const Dashboard = () => {
  const [latestItems, setLatestItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyItems, setDailyItems] = useState({ inCount: 0, outCount: 0 });
  const [chartData, setChartData] = useState({
    labels: ["ว่าง", "ใช้งาน", "เต็ม", "ปิดการใช้งาน"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ["#FFFFFF", "#0A8F08", "#FF0000", "#6B7280"],
        borderWidth: 1,
        borderColor: "#E5E7EB",
      },
    ],
  });

  // ฟังก์ชันดึงข้อมูล 5 รายการล่าสุด
  const fetchLatestItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("ไม่พบ token กรุณาล็อกอินใหม่");
      }

      const response = await fetch(`${BASE_URL}/api/dashboard/latest-items`, { // Updated URL
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        const formattedData = result.data.map((item, index) => ({
          key: String(index + 1),
          Trackingno: item.trackingNo,
          ProductName: item.productName,
          Status: item.status === "in" ? "เข้า" : "ออก",
          Amount: String(item.amount),
        }));
        setLatestItems(formattedData);
      }
    } catch (error) {
      console.error("Error fetching latest items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลสินค้าเข้าและออกประจำวัน
  const fetchDailyItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("ไม่พบ token กรุณาล็อกอินใหม่");
      }

      const response = await fetch(`${BASE_URL}/api/dashboard/daily-items`, { // Updated URL
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setDailyItems({
          inCount: result.data.inCount || 0,
          outCount: result.data.outCount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching daily items:", error.message);
    }
  };

  // ฟังก์ชันดึงข้อมูลสำหรับกราฟ
  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("ไม่พบ token กรุณาล็อกอินใหม่");
      }

      const response = await fetch(`${BASE_URL}/api/cell/summary`, { // Updated URL
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        const { data } = result;
        setChartData({
          labels: ["ว่าง", "ใช้งานได้", "เต็ม", "ปิดการใช้งาน"],
          datasets: [
            {
              data: [
                data.emptyBoxes,
                data.activeBoxes,
                data.inactiveBoxes,
                data.disabledBoxes,
              ],
              backgroundColor: ["#FFFFFF", "#0A8F08", "#FF0000", "#6B7280"],
              borderWidth: 1,
              borderColor: "#E5E7EB",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error.message);
    }
  };

  // ตั้งค่า Polling เพื่ออัปเดตข้อมูลทุก 5 วินาที
  useEffect(() => {
    // ดึงข้อมูลครั้งแรกเมื่อโหลดหน้า
    fetchLatestItems();
    fetchDailyItems();
    fetchChartData();

    // ตั้ง Polling ทุก 5 วินาทีสำหรับทุกฟังก์ชัน
    const interval = setInterval(() => {
      fetchLatestItems();
      fetchDailyItems();
      fetchChartData();
    }, 5000); // 5000ms = 5 วินาที

    // ล้าง interval เมื่อ component ถูกปิด
    return () => clearInterval(interval);
  }, []);

  return (
    <Content className="mt-10">
      <div className="flex justify-center items-center mt-[16px] gap-6">
        {/* ส่วนสินค้าเข้าแล้วออก */}
        <div className="w-[478px] h-[344px] bg-white rounded-xl p-5 flex flex-col">
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
              <p className="text-4xl font-bold">{dailyItems.inCount}</p>
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
              <p className="text-4xl font-bold">{dailyItems.outCount}</p>
              <p className="text-lg text-gray-600">จำนวนสินค้าออก</p>
            </div>
            <div className="mt-[-65px]">
              <p className="text-black text-[20px] font-bold">OUT</p>
            </div>
          </div>
        </div>

        {/* ส่วน 5 รายการล่าสุด */}
        <div className="w-[875px] h-[344px] bg-white rounded-xl overflow-hidden flex flex-col">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold pt-5 pl-5">
            5 รายการล่าสุด
          </h1>
          <div className="px-4 w-full flex-1 flex flex-col">
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
                backgroundColor: "#dcdcdc",
              }}
            ></div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-center mt-4">Loading...</p>
              ) : (
                latestItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex space-x-6 p-2.5 hover:bg-gray-50"
                  >
                    <div className="flex-[2] flex items-center justify-center text-center">
                      {item.Trackingno}
                    </div>
                    <div className="flex-[3] flex items-center justify-center text-center">
                      {item.ProductName}
                    </div>
                    <div className="flex-[3] flex items-center justify-center text-center">
                      <span
                        className={`flex items-center justify-center text-white text-xs font-semibold px-2 py-1 rounded-lg truncate w-[61px] h-[24px] ${
                          item.Status === "เข้า"
                            ? "bg-[#25c0e2]"
                            : "bg-[#f2383a]"
                        }`}
                      >
                        {item.Status}
                      </span>
                    </div>
                    <div className="flex-[2] flex items-center justify-center text-center">
                      {item.Amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนอื่นๆ */}
      <div className="flex justify-center items-center gap-6 mt-[16px]">
        <div className="w-[875px] h-[344px] bg-white rounded-[10px] flex flex-col p-4">
          <div className="flex-1">
            <DashboardLocationView />
          </div>
          <div className="flex items-center justify-start mt-2 space-x-6 ml-[20px]">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#0A8F08] border border-gray-200 rounded-full mr-1"></div>
              <span className="text-xs">(ใช้งาน)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 border border-gray-200 rounded-full mr-1"></div>
              <span className="text-xs">(เต็ม)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-500 border border-gray-200 rounded-full mr-1"></div>
              <span className="text-xs">(ปิดการใช้งาน)</span>
            </div>
          </div>
        </div>

        <div className="w-[478px] h-[344px] bg-white rounded-[10px] flex flex-col">
          <h1 className="opacity-70 text-[#030229] text-lg font-bold p-5">
            พื้นที่เก็บสินค้า
          </h1>
          <div className="flex-1 flex items-center justify-center">
            <div style={{ width: "270px", height: "270px" }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default Dashboard;