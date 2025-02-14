import { useInstructor } from "@/context/InstructorContext";
import axios from "axios";
import {
  LayoutDashboard,
  CircleDollarSign,
  ListCheck,
  File,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams,useNavigate } from "react-router-dom";

import TitleForm from "../components/TitleForm";
import DescriptionForm from "../components/DescriptionForm";
import ImageForm from "@/components/ImageForm";
import CategoryForm from "@/components/CategoryForm";
import PriceForm from "@/components/PriceForm";
import AttachmentsForm from "@/components/AttachmentsForm";
import ChapterForm from "@/components/ChapterForm";
import AlertBanner from "@/components/ui/AlertBanner";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
const CourseUpdatePage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const { instructor } = useInstructor();
  const navigate = useNavigate();
  if (!instructor) {
    return <Navigate to="/" />;
  }
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setCourse(response.data.course);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || error.message);
      })
      .finally(() => setLoading(false));
  }, []);
  if (!course && !loading) {
    return <Navigate to="/" />;
  }

  const requiredFields = [
    course?.title,
    course?.description,
    course?.coverImage,
    course?.price,
    course?.category,
    course?.chapters?.some((chapter) => chapter.isPublished === true),
  ];
  const completedFields = requiredFields.filter((field) => field);
  const isCompleted = requiredFields.every((field) => field);

  const handleCoursePublish = async()=>{
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}/editPublication`,{},{withCredentials:true});
      if(response.statusText === 'OK' && response.status === 200){
       setCourse((course)=>({...course,isPublished:response.data.isPublished}))
         toast.success(response.data.message) 
      }
    } catch (coursePublishError) {
      console.log(coursePublishError);
      toast.error(coursePublishError.response?.data.message || coursePublishError.message);
    }
  }
  const handleCourseDelete = async()=>{
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`,{withCredentials:true})
      if(response.statusText === 'OK' && response.status === 200){
        toast.success(response.data.message) 
        navigate(`/teacher/courses/create`)
     }
    } catch (handleCourseDeleteError) {
      console.log(handleCourseDeleteError);
      toast.error(handleCourseDeleteError.response?.data.message || handleCourseDeleteError.message);
    }
  }
  return (
    <>
      {!course?.isPublished && (
        <AlertBanner
          label="This course is unpublished. It will not be visible to students"
          variant="warning"
        />
      )}
      <div className="mt-4 p-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium my-2">Course setup</h1>
            <p className="text-sm text-slate-500">
              Complete all fields {completedFields?.length}/
              {requiredFields?.length}
            </p>
          </div>
          <div className="flex items-center gap-x-3">
          <Button
              variant="outline"
              disabled={!isCompleted}
              onClick={handleCoursePublish}
            >
              {course?.isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <Modal entity='course' deleteEntity={handleCourseDelete}>
            <Button>
              <Trash className="h-5 w-5" />
            </Button>
            </Modal>
          </div>
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
              <TitleForm
                setCourse={setCourse}
                courseTitle={course?.title}
                courseId={course?._id}
              />
              <DescriptionForm
                setCourse={setCourse}
                courseDescription={course?.description}
                courseId={course?._id}
              />
              <ImageForm
                setCourse={setCourse}
                courseImage={course?.coverImage}
                courseId={course?._id}
              />
              <CategoryForm
                setCourse={setCourse}
                courseCategory={course?.category}
                courseId={course?._id}
              />
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
              <ChapterForm
                setCourse={setCourse}
                courseId={course?._id}
                courseChapters={course?.chapters}
              />
            </div>

            <div className="flex items-center gap-x-2 ">
              <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
                <CircleDollarSign className="h-9 w-9 object-cover" />
              </div>
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <div>
              <PriceForm
                setCourse={setCourse}
                courseId={course?._id}
                coursePrice={course?.price}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2 ">
                <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
                  <File className="h-9 w-9 object-cover" />
                </div>
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentsForm
                setCourse={setCourse}
                courseId={course?._id}
                courseAttachments={course?.attachments}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseUpdatePage;
