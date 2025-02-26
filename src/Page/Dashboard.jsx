import React from 'react';
import { Layout } from 'antd'; // Import Layout component
import DashboardLocationView from "../Context/DashboardLocationView"; // Import DashboardLocationView component

const { Content } = Layout;

const Dashboard = () => {
  return (
    
      <Content className='mt-10 '>
        <div className='flex justify-center items-center mt-[16px] gap-6'>
            <div className='w-[478px] h-[344px] bg-white rounded-xl p-5'>
              <h1 className='opacity-70 text-[#030229] text-lg font-bold '>
                สินค้าเข้าแล้วออก
              </h1>
            </div>
            <div className='w-[875px] h-[340px] bg-white rounded-xl'>
              <h1 className='opacity-70 text-[#030229] text-lg font-bold p-5 '>
              5 Recent Orders
              </h1>
            </div>
        </div>
        <div className='flex justify-center items-center gap-6 mt-[16px]'>
            <div className='w-[875px] h-[343px] bg-white rounded-[10px]'>
              < DashboardLocationView/>
            </div>
            <div className='w-[478px] h-[343px] bg-white rounded-[10px]'>
              <h1 className='opacity-70 text-[#030229] text-lg font-bold p-5'>
              พื้นที่เก็บสินค้า
              </h1>
            </div>
        </div>
      </Content> 
  );
};

export default Dashboard;
