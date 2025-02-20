import axios from "axios";
import { useEffect, useState } from "react";
import CourseSideBarRoutes from './CourseSideBarRoutes';
import { useParams } from "react-router-dom";
const CourseSidebar = () => {
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
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
  }, []);
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
              <h1 className="font-semibold">{course?.title}</h1>
            </div>
            {/* Implement course progress tracker */}
            <div className="flex flex-col w-full">
              {course?.chapters.map((chapter) => (
               <CourseSideBarRoutes key={chapter?._id} course={course} chapter={chapter}  />
              ))}
            </div>
          </div>
  )
}

export default CourseSidebar