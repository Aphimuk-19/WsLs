  import React, { useState, useEffect } from "react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faBox,
    faCheckCircle,
    faTimesCircle,
    faBan,
    faCalendarAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import { useNavigate } from "react-router-dom"; // For redirecting to login if unauthorized

  const HeaderManageLocation = () => {
    const [summaryData, setSummaryData] = useState({
      totalBoxes: 0,
      activeBoxes: 0,
      disabledBoxes: 0,
      inactiveBoxes: 0,
      lastUpdate: null,
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchSummaryData = async () => {
        const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
        if (!token) {
          setError("กรุณาล็อกอินก่อนใช้งาน");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        try {
          const response = await fetch("http://172.18.43.37:3000/api/cell/summary", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Include token in headers
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("การรับรองความถูกต้องล้มเหลว กรุณาล็อกอินใหม่");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            setSummaryData({
              totalBoxes: result.data.totalBoxes,
              activeBoxes: result.data.activeBoxes,
              disabledBoxes: result.data.disabledBoxes,
              inactiveBoxes: result.data.inactiveBoxes,
              lastUpdate: result.data.lastUpdate,
            });
            setError(null);
          } else {
            throw new Error(result.error || "Failed to fetch summary data");
          }
        } catch (error) {
          console.error("Error fetching summary data:", error.message);
          setError(error.message);
          if (error.message.includes("ล็อกอิน")) {
            localStorage.removeItem("authToken"); // Clear invalid token
            navigate("/login"); // Redirect to login on auth failure
          }
        }
      };

      fetchSummaryData();
    }, [navigate]);

    return (
      <div>
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}
        <div className="flex space-x-7 items-center justify-center mt-[40px]">
          {/* Total Box */}
          <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#5b92ff",
                  opacity: 0.1,
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FontAwesomeIcon
                icon={faBox}
                style={{
                  color: "#5b92ff",
                  fontSize: "28px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            <div className="p-6">
              <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold">
                {summaryData.totalBoxes}
              </h1>
              <p className="opacity-70 text-[#030229] text-sm font-normal">
                Total Box
              </p>
            </div>
          </div>

          {/* Active Box */}
          <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#0a8f08",
                  opacity: 0.1,
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{
                  color: "#0a8f08",
                  fontSize: "28px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            <div className="p-6">
              <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold">
                {summaryData.activeBoxes}
              </h1>
              <p className="opacity-70 text-[#030229] text-sm font-normal">
                Active Box
              </p>
            </div>
          </div>

          {/* Inactive Box */}
          <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f2383a",
                  opacity: 0.1,
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FontAwesomeIcon
                icon={faTimesCircle}
                style={{
                  color: "#f2383a",
                  fontSize: "28px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            <div className="p-6">
              <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold">
                {summaryData.inactiveBoxes}
              </h1>
              <p className="opacity-70 text-[#030229] text-sm font-normal">
                Inactive Box
              </p>
            </div>
          </div>

          {/* Disabled Box */}
          <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#121212",
                  opacity: 0.1,
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FontAwesomeIcon
                icon={faBan}
                style={{
                  color: "#121212",
                  fontSize: "28px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            <div className="p-6">
              <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold">
                {summaryData.disabledBoxes}
              </h1>
              <p className="opacity-70 text-[#030229] text-sm font-normal">
                Disabled Box
              </p>
            </div>
          </div>

          {/* Last Update */}
          <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#5b92ff",
                  opacity: 0.1,
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{
                  color: "#5b92ff",
                  fontSize: "28px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            </div>
            <div className="p-6">
              <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold">
                {summaryData.lastUpdate || "N/A"}
              </h1>
              <p className="opacity-70 text-[#030229] text-sm font-normal">
                Last Update
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default HeaderManageLocation;