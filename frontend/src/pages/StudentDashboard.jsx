import CoursesCard from "@/components/CoursesCard";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
  if (loading) {
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-cyan-700" size={100} />
    </div>;
  }
  if (courses.length === 0) return;
  const purchasedCourses = courses.filter((course) => course.isEnrolled);
  const completedCourses = purchasedCourses.filter(
    (course) => course?.courseProgress?.progressPercentage === 100
  );
  const ongoingCourses = purchasedCourses.filter(
    (course) => course?.courseProgress?.progressPercentage < 100
  );

  if (!purchasedCourses.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] w-screen bg-gray-100 text-gray-700">
        <div className="md:bg-white md:shadow-lg md:rounded-2xl p-10 flex flex-col items-center text-center gap-4 animate-fadeIn">
          <h2 className="text-4xl font-bold">You have no enrolled courses</h2>
          <p className="text-lg text-gray-500">
            Discover new courses and start learning today!
          </p>
          <Button 
            onClick={() => navigate("/search")} 
            className=" hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          label="In Progress"
          className="bg-sky-500/20"
          icon={Clock}
          value={ongoingCourses.length}
        />
        <InfoCard
          label="Completed"
          className="bg-green-200/50"
          icon={CheckCircle}
          value={completedCourses.length}
        />
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
