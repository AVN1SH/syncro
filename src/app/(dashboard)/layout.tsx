import NavigationBar from '@/components/navigation-top/NavigationBar';
import React from 'react'
import { Provider } from 'react-redux';

const DashLayout = async ({children} : {children : React.ReactNode}) => {
  return (
    <div className="h-full">
      <div className="w-full bg-[#e3e5e8] dark:bg-[#1e1f22] h-[40px] fixed">
        <NavigationBar />
      </div>
        <main className="pt-[60px]">
          {children}
        </main>
    </div>
  );
}

export default DashLayout
