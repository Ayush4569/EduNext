import CoursesCard from "@/components/CoursesCard";
import InfoCard from "@/components/InfoCard";
import axios from "axios";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/courses`,
          {
            withCredentials: true,
          }
        );
        if (response.statusText === "OK" && response.data.courses) {
          setCourses(response.data.courses);
        }
      } catch (StudentDashboardError) {
        console.log(StudentDashboardError);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  console.log('courses', courses);
  if(loading){
    <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-700" size={100} />
      </div>
  }
  if(courses.length === 0) return;
  const completedCourses = courses.filter(course => course.courseProgress?.progressPercentage === 100);
  const ongoingCourses = courses.filter(course => course.courseProgress?.progressPercentage < 100 );
  const purchasedCourses = courses.filter(course => course.isEnrolled);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard label="In Progress" className='bg-sky-500/20' icon={Clock} value={ongoingCourses.length} />
        <InfoCard label="Completed" className='bg-green-200/50' icon={CheckCircle} value={completedCourses.length} />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 w-full">
        {purchasedCourses?.map((course) => {
          return <CoursesCard key={course._id} course={course} />;
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
