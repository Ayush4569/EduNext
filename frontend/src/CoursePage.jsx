import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "./context/StudentContext";
import NavbarRoutes from "./components/navbarroutes";
import CourseSidebar from "./components/CourseSidebar";
import { Menu } from "lucide-react";
import { SheetContent, SheetTrigger,Sheet, SheetTitle } from "./components/ui/sheet";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  const { student } = useStudent();
  if (!student) {
    navigate("/");
  }
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`,
          {
            params: { courseId },
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
  }, []);

  return (
    <>
      {course ? (
        <div className="h-full">
          <div className="h-20 md:pl-80 fixed inset-y-0 w-full z-50">
            <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
              <Sheet>
                <SheetTrigger asChild className="md:hidden pr-4 hover:opacity-75 transition">
                  <Menu className="h-10 w-10 opacity-75" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-white">
                <SheetTitle className="sr-only">Course Sidebar</SheetTitle>
                 <CourseSidebar course={course} />
                </SheetContent>
              </Sheet>
              <NavbarRoutes />
            </div>
          </div>
          <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
            <CourseSidebar course={course} />
          </div>
          <main className="md:pl-80 pt-20 h-full ">
            <p>here video will be rendered</p>
          </main>
        </div>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center">
          <p className="text-gray-300">
            Error fetching this course pls try refreshing the page
          </p>
        </div>
      )}
    </>
  );
};

export default CoursePage;
