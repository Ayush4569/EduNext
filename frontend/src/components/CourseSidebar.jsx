import axios from "axios";
import { useEffect, useState } from "react";
import CourseSideBarRoutes from "./CourseSideBarRoutes";
import { useParams } from "react-router-dom";
const CourseSidebar = () => {
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
  const courseProgress = course?.courseProgress?.progressPercentage || 0;
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
      <div className="p-8 flex flex-col gap-y-2 border-b">
        <h1 className="font-semibold">{course?.title}</h1>
        {course?.isEnrolled && (
          <>
            <div className="w-full">
              <div className="w-full bg-gray-200 rounded-sm h-4 overflow-hidden shadow-md">
                <div
                  className={`h-full bar transition-all duration-1000 ease-out`}
                  style={{
                    width: `${courseProgress}%`,
                  }}
                >
                  <span className="sr-only">{courseProgress}% Complete</span>
                </div>
              </div>
            </div>
            <p className="text-base text-green-600/80">
              {courseProgress}% complete
            </p>
          </>
        )}
      </div>
      {/* Implement course progress tracker */}
      <div className="flex flex-col w-full">
        {course?.chapters.map((chapter) => (
          <CourseSideBarRoutes
            key={chapter?._id}
            course={course}
            chapter={chapter}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
