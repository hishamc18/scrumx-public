"use client";
import React, { useState } from "react";
import ProjectSidebar from "../../../components/Project/ProjectSidebar";


function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  

  return (
    <div className="flex">
      
      <div className={`transition-all   ${isSidebarExpanded ? "w-[calc(100%-100px)] " : "w-[calc(100%-0px)]"} `}>
        {children}
      </div>
      <div className="bg-white">
        <ProjectSidebar setSidebarExpanded={setIsSidebarExpanded} />
      </div>
    </div>
  );
}

export default Layout;

