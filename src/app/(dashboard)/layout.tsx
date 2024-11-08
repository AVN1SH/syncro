import NavigationBar from '@/components/navigation-top/NavigationBar';
import React from 'react'

const DashLayout = async ({children} : {children : React.ReactNode}) => {
  return (
    <div className="h-full">
      <div className="w-full bg-zinc-300 dark:bg-[#1e1f22] h-[60px] fixed">
        {/* <NavigationBar /> */}
      </div>
      <main className="pt-[60px]">
        {children}
      </main>
    </div>
  );
}

export default DashLayout
