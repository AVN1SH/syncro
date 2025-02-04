import NavigationSidebar from "@/components/navigation/NavigationSidebar"

const page = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
      <div className="fixed w-[60px] bottom-0 top-[40px]">
        <NavigationSidebar />
      </div>
      {children}
      {/* <div className="flex h-full w-[250px] z-30 flex-col fixed inset-y-0 top-[60px] left-[60px] bg-[#2b2d31]">
        <Primary />
        <div className="fixed left-[310px] top-[60px] right-0 bottom-0">
          <Secondary />
        </div>
      </div> */}
    </div>
  )
}
export default page
