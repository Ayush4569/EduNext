import React from "react";
import MobileSideBar from "./MobileSideBar";
import Navbarroutes from "./Navbarroutes";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSideBar />
      <Navbarroutes />
    </div>
  );
};

export default Navbar;
