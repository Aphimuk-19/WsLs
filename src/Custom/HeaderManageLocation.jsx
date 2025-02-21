import React from "react";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const HeaderManageLocation = () => {
  return (
    <div>
      {/* Header with Capacity and Location Add Controls */}
      <div className="flex space-x-7 items-center justify-center mt-[40px]">
        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#5b92ff",
              opacity: 0.1,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppstoreOutlined style={{ color: "#000", fontSize: "24px" }} />
          </div>
          <div className="p-6">
            <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold ">
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Total Box
            </p>
          </div>
        </div>

        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#0a8f08",
              opacity: 0.1,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlined style={{ color: "#000", fontSize: "24px" }} />
          </div>
          <div className="p-6">
            <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold ">
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Active Box
            </p>
          </div>
        </div>

        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#f2383a",
              opacity: 0.1,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseCircleOutlined style={{ color: "#000", fontSize: "24px" }} />
          </div>
          <div className="p-6">
            <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold ">
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Inactive Box
            </p>
          </div>
        </div>

        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#121212",
              opacity: 0.1,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StopOutlined style={{ color: "#000", fontSize: "24px" }} />
          </div>
          <div className="p-6">
            <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold ">
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Disabled Box
            </p>
          </div>
        </div>

        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#5b92ff",
              opacity: 0.1,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CalendarOutlined style={{ color: "#000", fontSize: "24px" }} />
          </div>
          <div className="p-6">
            <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold ">
              01/01/68
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Lastupdate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderManageLocation;
