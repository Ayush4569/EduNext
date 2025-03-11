import ChapterAccess from "@/components/ChapterAccess";
import ChapterDescriptionForm from "@/components/ChapterDescriptionForm";
import ChapterTitleForm from "@/components/ChapterTitleForm";
import ChapterVideo from "@/components/ChapterVideo";
import Modal from "@/components/Modal";
import AlertBanner from "@/components/ui/AlertBanner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft, LayoutDashboard, Eye, Video, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";

const ChapterUpdatePage = () => {
  const { courseId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const isValidChapter = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASEURL
          }/api/v1/chapters/${courseId}/${chapterId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setChapter(response.data.chapter);
          if(!response.data.chapter){
            navigate(`/teacher/courses/${courseId}`)
          }
        }
      } catch (error) {
        toast.error(error.response?.data.message || error.message);
        console.log(error);
      }
    };
    isValidChapter();
  }, [navigate,courseId,chapterId]);
  
  const requiredFields = [chapter?.title, chapter?.content, chapter?.video];
  const completedFields = requiredFields.filter((field) => field);
  const isCompleted = requiredFields.every((field) => field);

  const handleChapterPublish = async()=> {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${chapterId}/editPublication`,{},{withCredentials:true});
      if(response.status === 200){
       setChapter((chapter)=>({...chapter,isPublished:response.data.isPublished}))
         toast.success(response.data.message) 
      }
    } catch (chapterPublishError) {
      console.log(chapterPublishError);
      toast.error(chapterPublishError.response?.data.message || chapterPublishError.message);
    }
  }
  const handleChapterDelete = async()=>{
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${chapterId}`,{withCredentials:true});
      if(response.status === 200){
         toast.success(response.data.message) 
         navigate(`/teacher/courses/${courseId}`)
      }
    } catch (chapterDeleteError) {
      console.log(chapterDeleteError);
      toast.error(chapterDeleteError.response?.data.message || chapterDeleteError.message);
    }
  }
  return (
    <>
     {
      !chapter?.isPublished && (
        <AlertBanner
        label="This chapter is unpublished. It will not be visible in the course"
        variant="warning"
      />
      )
     }
      <div className="mt-4 p-5 h-full">
        <div>
          <Link
            className="flex items-center gap-x-3"
            to={`/teacher/courses/${courseId}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course setup
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium my-2">Chapter creation</h1>
            <p className="text-sm text-slate-500">
              Complete all fields {completedFields?.length}/
              {requiredFields?.length}
            </p>
          </div>
          <div className="flex items-center gap-x-3">
            <Button
              variant="outline"
              disabled={!isCompleted}
              onClick={handleChapterPublish}
            >
              {chapter?.isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <Modal entity='chapter' deleteEntity={handleChapterDelete}>
            <Button>
              <Trash className="h-5 w-5" />
            </Button>
            </Modal>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
                <LayoutDashboard className="h-9 w-9 object-cover" />
              </div>
              <h2 className="text-xl">Customize your chapter</h2>
            </div>

            <div>
              <ChapterTitleForm
                setChapter={setChapter}
                chapterId={chapterId}
                chapterTitle={chapter?.title}
                courseId={courseId}
              />
              <ChapterDescriptionForm
                setChapter={setChapter}
                chapterId={chapterId}
                chapterDescription={chapter?.content}
                courseId={courseId}
              />
            </div>

            <div>
              <div className="flex items-center gap-x-2 my-4 ">
                <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
                  <Eye className="h-9 w-9 object-cover" />
                </div>
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <ChapterAccess
                setChapter={setChapter}
                chapterId={chapterId}
                isChapterFree={chapter?.isFree}
                courseId={courseId}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <div className="bg-sky-100 h-12 w-12 p-3 rounded-full flex items-center justify-center">
                <Video className="h-9 w-9 object-cover" />
              </div>
              <h2 className="text-xl">Add a video</h2>
            </div>
            <div>
              <ChapterVideo
                setChapter={setChapter}
                chapterId={chapterId}
                chapterVideo={chapter?.video}
                courseId={courseId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterUpdatePage;
