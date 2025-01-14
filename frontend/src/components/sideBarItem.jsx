import { cn } from "@/lib/utils";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SideBarItem = ({ icon:Icon, label, href }) => {
  const location = useLocation();
  const navigate = useNavigate()

  
  const isActive = location.pathname === href || location.pathname.includes(href)
  return (
    <button
       onClick={()=>navigate(href)}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && 'text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20 '
      )}
    
    >
      <div className="flex gap-x-2 py-4 items-center ">
        <Icon size={22} className={cn("text-slate-500",isActive && "text-sky-500")}/>
        {label}
      </div>
      <div className={cn("ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",isActive && "opacity-100")}/>
    </button>
  );
};

export default SideBarItem;
