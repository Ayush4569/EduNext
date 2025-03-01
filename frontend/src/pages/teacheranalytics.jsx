import Chart from '@/components/Chart';
import DataCard from '@/components/DataCard';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Teacheranalytics = () => {
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
      } catch (TeacheranalyticsError) {
        console.log(TeacheranalyticsError);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const publishedAndSoldCourses = courses?.filter(
    (course) => course.isPublished && course.enrolledStudents.length>0
  );  
  const generatedRevenue = publishedAndSoldCourses.reduce((acc,curr)=> acc = acc+(curr.price*curr.enrolledStudents.length),0)
  console.log('publishedAndSoldCourses',publishedAndSoldCourses);
  console.log('generatedRevenue',generatedRevenue);

  if(loading){
    <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-700" size={100} />
      </div>
  }
  if(!courses || courses.length === 0){
    return <div className="flex flex-col items-center justify-center h-[90vh] w-screen bg-gray-100 text-gray-700">
    <div className="md:bg-white md:shadow-lg md:rounded-2xl p-10 flex flex-col items-center text-center gap-4 animate-fadeIn">
      <h2 className="text-4xl font-bold">You have no enrolled courses</h2>
      <p className="text-lg text-gray-500">
        Create and publish courses to start earning today!
      </p>
      <Button 
        onClick={() => navigate("/teacher/courses/create")} 
        className=" hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
      >
        Create Course
      </Button>
    </div>
  </div>
  }
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total revenue" shouldFormat  value={generatedRevenue} />
        <DataCard label="Total sales"  value={publishedAndSoldCourses.length} />
        <Chart data={publishedAndSoldCourses}/>
      </div>
    </div>
  )
}

export default Teacheranalytics