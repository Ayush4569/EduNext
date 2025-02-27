import { useStudent } from "../context/StudentContext";
import NavbarRoutes from "./navbarroutes";
import CourseSidebar from "./CourseSidebar";
import { Loader2, Menu } from "lucide-react";
import {
  SheetContent,
  SheetTrigger,
  Sheet,
  SheetTitle,
} from "../components/ui/sheet";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CourseLayout = () => {
  const [course, setCourse] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { student } = useStudent();
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`,
          {
            withCredentials: true,
          }
        );
        if (response.statusText === "OK" && response.data.course) {
          setCourse(response.data.course);
        }
      } catch (error) {
        console.log("Error fetching course", error);
      }
    };
    fetchCourse();
  }, [courseId]);
 
  if (!student) {
    navigate("/");
  }


  return (
    <div className="h-full">
      <div className="h-20 md:pl-80 fixed inset-y-0 w-full z-50">
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
          <Sheet>
            <SheetTrigger
              asChild
              className="md:hidden pr-4 hover:opacity-75 transition"
            >
              <Menu className="h-10 w-10 opacity-75" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
              <SheetTitle className="sr-only">Course Sidebar</SheetTitle>
              <CourseSidebar course={course} courseProgress={course?.courseProgress } />
            </SheetContent>
          </Sheet>
          <NavbarRoutes />
        </div>
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} courseProgress={course?.courseProgress } />
      </div>
      <main className="md:pl-80 pt-20 h-full ">
        <Outlet context={{course,setCourse}} />
      </main>
    </div>
  );
};

export default CourseLayout;
