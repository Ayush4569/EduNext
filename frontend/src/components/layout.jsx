import Sidebar from "./Sidebar";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="h-full">
      <div className="md:pl-56 h-[80px] fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="md:flex h-full w-56 flex-col fixed z-50 inset-y-0  border hidden">
        <Sidebar />
      </div>
      <div className="md:pl-56 pt-[80px] w-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
