import React from 'react';
import { Layout } from 'antd'; // Import Layout component

const { Content } = Layout;

const Dashboard = () => {
  return (
    
      <Content className='mt-10 '>
        <div className='flex justify-center items-center mt-[16px] gap-6'>
            <div className='w-[478px] h-[344px] bg-white rounded-xl'></div>
            <div className='w-[875px] h-[340px] bg-white rounded-xl'></div>
        </div>
        <div className='flex justify-center items-center gap-6 mt-[16px]'>
            <div className='w-[875px] h-[343px] bg-white rounded-[10px]'></div>
            <div className='w-[478px] h-[343px] bg-white rounded-[10px]'></div>
        </div>
      </Content> 
  );
};

export default Dashboard;
