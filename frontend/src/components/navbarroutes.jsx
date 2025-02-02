import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { useInstructor } from "@/context/InstructorContext";
const Navbarroutes = () => {
  const location = useLocation();
  // const isTeacher = location.pathname.startsWith('/teacher');
  // const isStudent = location.pathname.includes('/chapter')
  const { instructor } = useInstructor();
  const { student } = useStudent();
  const navigate = useNavigate();
  const logOut = async () => {
    const apiEndpoint = instructor
      ? `${import.meta.env.VITE_BASEURL}/api/v1/instructors/logout`
      : `${import.meta.env.VITE_BASEURL}/api/v1/students/logout`;
    try {
      const response = await axios.get(apiEndpoint);
      if (response.statusText === "OK") {
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("logout error", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div className="flex gap-x-4 items-center ml-auto">
      {(instructor || student) && (
        <>
          <Button variant="outline" onClick={() => logOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button variant="outline">
            {instructor ? instructor?.email : student?.email}
          </Button>
        </>
      )}
      <div>
        <FontAwesomeIcon icon={faUser} className="h-5" />
      </div>
    </div>
  );
};

export default Navbarroutes;
