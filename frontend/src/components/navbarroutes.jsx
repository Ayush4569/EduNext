import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { LogOut, Search } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { useInstructor } from "@/context/InstructorContext";
import { Input } from "./ui/input";
const Navbarroutes = () => {
  const location = useLocation();
  // const isTeacher = location.pathname.startsWith('/teacher');
  // const isStudent = location.pathname.includes('/chapter')
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get("category");
  const { instructor } = useInstructor();
  const { student } = useStudent();
  const searchPage = pathname.includes("/search");
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
    <>
      {searchPage && (
        <div className="hidden md:!block">
          <div className="relative">
            <Search className="h-5 w-5 absolute top-[10px] left-3 text-slate-600" />
            <Input
              className="w-full md:w-[300px] pl-9 bg-slate-100 focus-visible:ring-slate-200 rounded-md"
              placeholder="Search for courses"
            />
          </div>
        </div>
      )}
      <div className="flex gap-x-4 items-center ml-auto">
        {(instructor || student) && (
          <>
            <Button variant="outline" onClick={() => logOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="ghost">
              {instructor ? instructor?.email : student?.email}
            </Button>
          </>
        )}
        <div>
          <FontAwesomeIcon icon={faUser} className="h-5" />
        </div>
      </div>
    </>
  );
};

export default Navbarroutes;
