import React from "react";
import { Input, Select } from "antd";

const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log("search:", value);
};


const Register = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center bg-jib">
      {/* กล่องตรงกลางหน้าจอ */}
      <div className="w-[1023px] h-[631px] bg-white/60 rounded-[32px] shadow-[7px_5px_10px_0px_rgba(0,0,0,0.60)] flex">
        {/* ด้านซ้าย */}
        <div className="w-1/2 h-full flex justify-center items-center bg-[#252265] rounded-tl-[32px] rounded-bl-[32px]">
          <img src="/src/Image/Logo.webp" />
        </div>

        {/* ด้านขวา*/}
        <div className="w-1/2 h-full ">
          <div className="flex flex-col justify-start items-center">
            <p className="text-black text-[37.45px] font-bold uppercase">
              Register
            </p>
            <p className="text-neutral-600 text-base font-normal">
              Warehouse Support & Location System
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 mb-3 mt-5">
            <Input placeholder="FirstName" className="input-style" />
            <Input placeholder="LastNamee" className="input-style" />
          </div>
          <div className="flex flex-col justify-start items-center gap-3 ">
            <Select
              showSearch
              placeholder="Department"
              optionFilterProp="label"
              onChange={onChange}
              onSearch={onSearch}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
              className="input-style1"
            />
            <Input placeholder="Employee ID" className="input-style1" />
            <Input placeholder="Email" className="input-style1" />
            <Input placeholder="Phone Number" className="input-style1" />
            <Input placeholder="Password" className="input-style1" />
            <Input placeholder="Confirm Password" className="input-style1" />

            <button className="w-[158.38px] h-[54px] bg-[#252265] rounded-[18.72px] text-white hover:bg-[#ffffff] hover:text-[#252265]  " >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;
