import { useInstructor } from "@/context/InstructorContext";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";

import TitleForm from "../components/TitleForm";
import DescriptionForm from "../components/DescriptionForm";
import ImageForm from "@/components/ImageForm";
const CoursesForm = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const { instructor } = useInstructor();
  // if (!instructor) {
  //   return <Navigate to="/" />;
  // }
  // useEffect(() => {
  //  axios.get(`${import.meta.env.VITE_BASEURL}/courses/getCourse/${courseId}`,{withCredentials:true})
  //        .then((response)=>{
  //         setCourse(response.data)
  //         console.log(response.data);
  //         toast.success('course fetched')
  //        })
  //        .catch((error)=>{
  //         console.log(error);
  //         toast.error(error?.response?.data?.message || error.message)
  //        })
  //        .finally(()=>setLoading(false))
  // }, [])

  // if(!course && !loading){
  //     return <Navigate to='/'/>
  // }

  const requiredFields = [
    course?.title,
    course?.description,
    course?.coverImage,
    course?.price,
    course?.category,
  ];

  // const completedFields = requiredFields.filter((field)=> field!=null).length/requiredFields.length


  return (
    <div className="mt-4 p-5 h-full">
      <div>
        <h1 className="text-2xl font-medium my-2">Course setup</h1>
        <p className="text-sm text-slate-500">Complete all fields 4/5</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
        <div className="flex items-center gap-x-2">
        <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
          <LayoutDashboard className="h-9 w-9 object-cover" />
        </div>
        <h2 className="text-xl">Customize your course</h2>
      </div>
      <TitleForm courseTitle={course?.title} courseId = {course?._id}/>
      <DescriptionForm courseDescription={course?.title} courseId = {course?._id}/>
      <ImageForm courseDescription={course?.title} courseId = {course?._id}/>

      </div>
   
      </div>
      
    
    </div>
  );
};

export default CoursesForm;
