import { useInstructor } from "@/context/InstructorContext";
import axios from "axios";
import { LayoutDashboard,CircleDollarSign,ListCheck,File } from "lucide-react";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";

import TitleForm from "../components/TitleForm";
import DescriptionForm from "../components/DescriptionForm";
import ImageForm from "@/components/ImageForm";
import CategoryForm from "@/components/CategoryForm";
import PriceForm from "@/components/PriceForm";
import AttachmentsForm from "@/components/AttachmentsForm";
import ChapterForm from "@/components/ChapterForm";
const CourseUpdatePage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const { instructor } = useInstructor();
  if (!instructor) {
    return <Navigate to="/" />;
  }
  useEffect(() => {
   axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`,{withCredentials:true})
         .then((response)=>{
          setCourse(response.data)
         })
         .catch((error)=>{
          console.log(error);
          toast.error(error?.response?.data?.message || error.message)
         })
         .finally(()=>setLoading(false))
  }, [])
  if(!course && !loading){
      return <Navigate to='/'/>
  }

  const requiredFields = [
    course?.title,
    course?.description,
    course?.coverImage,
    course?.price,
    course?.category,
    course?.chapters.some((chapter)=> chapter.isPublished === true)
  ];
  // console.log(course);
  const completedFields = requiredFields.filter((field)=> field!=null || field!=undefined)
  return (
    <div className="mt-4 p-5 h-full">
      <div>
        <h1 className="text-2xl font-medium my-2">Course setup</h1>
        <p className="text-sm text-slate-500">Complete all fields {completedFields?.length}/{requiredFields?.length}</p>
        {/* <p className="text-sm text-slate-500">Complete all fields 3/5</p> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
        <div className="flex items-center gap-x-2">
        <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
          <LayoutDashboard className="h-9 w-9 object-cover" />
        </div>
        <h2 className="text-xl">Customize your course</h2>
      </div>
      <div>
      <TitleForm  setCourse ={setCourse} courseTitle={course?.title} courseId = {course?._id}/>
      <DescriptionForm setCourse ={setCourse} courseDescription={course?.description} courseId = {course?._id}/>
      <ImageForm  setCourse ={setCourse} courseImage={course?.coverImage} courseId = {course?._id}/>
      <CategoryForm  setCourse ={setCourse} courseCategory={course?.category} courseId = {course?._id}/>
      </div>
     
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-x-2">
        <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
          <ListCheck className="h-9 w-9 object-cover" />
        </div>
        <h2 className="text-xl">Course chapters</h2>
      </div>
      <div>
       <ChapterForm setCourse ={setCourse} courseId={course?._id} courseChapters={course?.chapters}/>
      </div>

      <div className="flex items-center gap-x-2 ">
        <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
          <CircleDollarSign className="h-9 w-9 object-cover" />
        </div>
        <h2 className="text-xl">Sell your course</h2>
      </div>
        <div><PriceForm setCourse ={setCourse} courseId={course?._id} coursePrice={course?.price}/></div>
      <div>
      <div className="flex items-center gap-x-2 ">
      <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
          <File className="h-9 w-9 object-cover" />
        </div>
        <h2 className="text-xl">Resources & Attachments</h2>
      </div>
      <AttachmentsForm setCourse ={setCourse} courseId={course?._id} courseAttachments={course?.attachments}/>
      </div>
      </div>
      </div>
      
    
    </div>
  );
};

export default CourseUpdatePage;
