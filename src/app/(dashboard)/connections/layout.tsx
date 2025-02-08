import NavigationSidebar from "@/components/navigation/NavigationSidebar"

const page = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
      <div className="fixed w-[60px] bottom-0 top-0 z-20">
        <NavigationSidebar />
      </div>
      {children}
    </div>
  )
}
export default page