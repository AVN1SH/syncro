import React from 'react'

const DashLayout = async ({children} : {children : React.ReactNode}) => {
  return (
    <div className="h-full">
        <main className="pt-[60px]">
          {children}
        </main>
    </div>
  );
}

export default DashLayout;