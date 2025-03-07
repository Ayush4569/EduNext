import { DataTable } from '@/components/ui/DataTable'
import { Button } from '../components/ui/button'
import React, { useState } from 'react';
import { Rocket, PlusCircle } from "lucide-react";
import { columns } from '@/components/ui/Columns'
import { useEffect } from 'react'
import axios from 'axios'
import { Navigate,useNavigate } from 'react-router-dom'


const Teacherpage = () => {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
   const fetchCourses = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/courses/instructorCourses`,{withCredentials:true})
      if( response.data){
        setCourses(response.data.courses)
      }
    } catch (error) {
      console.log('Error fetching courses',error);  
    }
   }
   fetchCourses()
  }, [])
  
  if(!courses || courses.length === 0){
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
      <div className="md:bg-white md:shadow-lg flex flex-col justify-center md:rounded-2xl p-10 max-w-lg text-center animate-fadeIn">
        <div className="flex justify-center mb-4">
          <Rocket size={80} className="text-blue-600 animate-bounce" />
        </div>
        <h2 className=" text-xl md:text-3xl font-bold text-gray-800">No Courses Created Yet!</h2>
        <p className="text-gray-500 mt-2">
          Inspire students by creating your first course today. Start sharing your knowledge with the world! 🌍
        </p>
        <Button
          onClick={() => navigate("/teacher/courses/create")}
          className="mt-6 bg-blue-600 text-center hover:bg-blue-700 text-white rounded-lg text-lg font-semibold flex items-center gap-2 transition-transform transform hover:scale-105"
        >
          <PlusCircle size={20} />
          Create Your First Course
        </Button>
      </div>
    </div>
  );

  }

  return (
    <div className='p-6'>
    <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default Teacherpage