import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { useInstructor } from "@/context/InstructorContext";

import SearchInput from "./SearchInput";
const NavbarRoutes = ({ isCourseLayout = false }) => {
  const { pathname } = useLocation();
  const { instructor, setInstructor } = useInstructor();
  const { student, setStudent } = useStudent();
  const searchPage = pathname.includes("/search");
  const navigate = useNavigate();
  const logOut = async () => {
    const apiEndpoint = instructor
      ? `${import.meta.env.VITE_BASEURL}/api/v1/instructors/logout`
      : `${import.meta.env.VITE_BASEURL}/api/v1/students/logout`;
    try {
      const response = await axios.get(apiEndpoint);
      if (response.status === 200) {
        instructor ? setInstructor(null) : setStudent(null);
        instructor ? navigate("/teacher/login") : navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("logout error", error);
    }
  };
  const exit = ()=>{
    if(student){
      navigate("/dashboard")
    }else{
      navigate("/teacher/courses")
  }
}
  return (
    <>
      {searchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex md:gap-x-4 gap-x-2 justify-end items-center ml-auto">
        {(instructor || student) && (
          <>
            {!isCourseLayout ? (
              <Button variant="outline" onClick={logOut}>
                <LogOut className="h-4 w-4 md:mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={exit}
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                Exit
              </Button>
            )}
            <Button variant="ghost">
              <p className="md:text-base text-xs">
                {instructor ? instructor?.email : student?.email}
              </p>
            </Button>
          </>
        )}
        <div>
          <img
            className="md:h-11 md:w-11 h-8 w-8"
            src={
              student
                ? `${import.meta.env.VITE_BASEURL}/public${
                    student?.profileImage
                  }`
                : `${import.meta.env.VITE_BASEURL}/public${
                    instructor?.profileImage
                  }`
            }
          />
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
