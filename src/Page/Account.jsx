import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Account = () => {
  return (
    <div className="mt-[30px] flex justify-center">
      <div className="w-full max-w-[1013px]">
        {/* Title */}
        <div className="flex items-center justify-start space-x-4">
          <h1 className="text-black text-2xl font-medium mb-[30px]">
            Profile detail
          </h1>
        </div>
        <div
          style={{
            height: "1px",
            backgroundColor: "#dcdcdc", // สีเส้นสีเทาอ่อน
            margin: "10px 0",
          }}
        ></div>

        {/* Profile */}
        <div className="flex items-center space-x-4 mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Profile</h1>
          <div className="flex items-center space-x-4 ml-auto mr-auto">
            <img
              className="w-[75px] h-[75px] rounded-full"
              src="/src/Image/man-4123268_1280.jpg"
            />
            <p>John Doe</p>
          </div>
          <div>
          <Link to="/EditProfilePage" className="text-[#1565f9]">
              Edit Profile
            </Link>
          </div>
        </div>

        <div
          style={{
            width: "1013px",
            height: "1px",
            backgroundColor: "#dcdcdc", // light gray line color
            margin: "10px auto", // Center the line horizontally
          }}
        ></div>

        {/* Department */}
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Department</h1>
          <p className="text-black mx-auto">Logistic</p>
        </div>

        <div
          style={{
            width: "1013px",
            height: "1px",
            backgroundColor: "#dcdcdc", // light gray line color
            margin: "10px auto", // Center the line horizontally
          }}
        ></div>

        {/* Email */}
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Email</h1>
          <p className="text-black mx-auto  ">Example.Ex@Gmail.com</p>
        </div>

        <div
          style={{
            width: "1013px",
            height: "1px",
            backgroundColor: "#dcdcdc", // light gray line color
            margin: "10px auto", // Center the line horizontally
          }}
        ></div>
        {/* Phone Number */}
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Phone Number</h1>
          <p className="text-black mx-auto">081-119-9119</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
