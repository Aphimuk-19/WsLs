import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCheckCircle,
  faTimesCircle,
  faBan,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const HeaderManageLocation = () => {
  console.log("Rendering HeaderManageLocation"); // ตรวจสอบการ render

  return (
    <div>
      {/* Header with Capacity and Location Add Controls */}
      <div className="flex space-x-7 items-center justify-center mt-[40px]">
        {/* Total Box */}
        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "60px",
            }}
          >
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
                transform: "translate(-50%, -50%)", // จัดกึ่งกลาง
                zIndex: 1,
              }}
            />
          </div>
          <div className="p-6">
            <h1 className="opacity-70 text-[#030229] text-[22px] font-extrabold">
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Total Box
            </p>
          </div>
        </div>

        {/* Active Box */}
        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "60px",
            }}
          >
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
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Active Box
            </p>
          </div>
        </div>

        {/* Inactive Box */}
        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "60px",
            }}
          >
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
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Inactive Box
            </p>
          </div>
        </div>

        {/* Disabled Box */}
        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "60px",
            }}
          >
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
              58
            </h1>
            <p className="opacity-70 text-[#030229] text-sm font-normal">
              Disabled Box
            </p>
          </div>
        </div>

        {/* Lastupdate */}
        <div className="w-[268px] h-[116px] bg-white rounded-[10px] flex items-center justify-start p-5 shadow-sm">
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "60px",
            }}
          >
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