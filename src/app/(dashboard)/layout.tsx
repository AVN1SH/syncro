import NavigationSidebar from '@/components/navigation/NavigationSidebar';
import React from 'react'

const DashLayout = async ({children} : {children : React.ReactNode}) => {
  return (
    <div className="h-full">
      <div className="fixed w-[60px] bottom-0 top-0 z-20 shadow-[0px_0px_15px_rgba(0,0,0,0.6)]">
        <NavigationSidebar />
      </div>
        <main className="">
          {children}Z
        </main>
    </div>
  );
}

export default DashLayout;