import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    department: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    employeeId: "",
    role: "", // เพิ่ม role ใน state เริ่มต้น
  });
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/Login");
      return;
    }

    try {
      const response = await axios.get("http://172.18.43.37:3000/api/users/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;

      setProfile({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        department: userData.department || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        profilePicture: userData.profilePicture || "",
        employeeId: userData.employeeId || "N/A",
        role: userData.role || "", // เพิ่ม role
      });

      console.log("Fetched Profile Data:", userData);
      console.log("Profile Picture URL:", userData.profilePicture);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        console.log("Unauthorized, redirecting to login");
        localStorage.removeItem("authToken");
        navigate("/Login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/EditProfilePage", {
      state: {
        userData: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          department: profile.department,
          email: profile.email,
          phoneNumber: profile.phoneNumber, // แก้จาก phone เป็น phoneNumber
          profilePicture: profile.profilePicture,
          employeeId: profile.employeeId,
          role: profile.role,
        }
      }
    });
  };

  return (
    <div className="mt-[30px] flex justify-center">
      <div className="w-full max-w-[1013px]">
        <div className="flex items-center justify-start space-x-4">
          <h1 className="text-black text-2xl font-medium mb-[30px]">
            Profile detail
          </h1>
        </div>
        <div style={{ height: "1px", backgroundColor: "#dcdcdc", margin: "10px 0" }}></div>

        <div className="flex items-center space-x-4 mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Profile</h1>
          <div className="flex items-center space-x-4 ml-auto mr-auto">
            {loading ? (
              <div className="w-[75px] h-[75px] rounded-full bg-gray-200 animate-pulse"></div>
            ) : profile.profilePicture ? (
              <img
                className="w-[75px] h-[75px] rounded-full object-cover"
                src={profile.profilePicture}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "/src/Image/man-4123268_1280.jpg";
                  console.log("Failed to load profile picture, using fallback");
                }}
              />
            ) : (
              <div className="w-[75px] h-[75px] rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                {profile.firstName.charAt(0)}
              </div>
            )}
            <p>{profile.firstName} {profile.lastName}</p>
          </div>
          <div>
            <button onClick={handleEditProfile} className="text-[#1565f9]">
              Edit Profile
            </button>
          </div>
        </div>

        <div style={{ width: "1013px", height: "1px", backgroundColor: "#dcdcdc", margin: "10px auto" }}></div>
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Employee ID</h1>
          <p className="text-black mx-auto">{profile.employeeId}</p>
        </div>
        <div style={{ width: "1013px", height: "1px", backgroundColor: "#dcdcdc", margin: "10px auto" }}></div>
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Department</h1>
          <p className="text-black mx-auto">{profile.department || "N/A"}</p>
        </div>
        <div style={{ width: "1013px", height: "1px", backgroundColor: "#dcdcdc", margin: "10px auto" }}></div>
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Email</h1>
          <p className="text-black mx-auto">{profile.email || "N/A"}</p>
        </div>
        <div style={{ width: "1013px", height: "1px", backgroundColor: "#dcdcdc", margin: "10px auto" }}></div>
        <div className="flex items-center justify-between w-full mt-10 mb-10">
          <h1 className="text-black text-lg font-medium">Phone Number</h1>
          <p className="text-black mx-auto">{profile.phoneNumber || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;