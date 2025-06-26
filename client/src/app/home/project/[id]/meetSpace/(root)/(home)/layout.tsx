


// import Sidebar from "@/components/streamVideo/Sidebar"
import { ReactNode } from "react"


const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main className="relative">
     

      <div className="flex ">
        {/* <Sidebar /> */}
        
        <section className="flex pr-16 h-full mt-10 flex-1 flex-col">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
}

export default RootLayout
