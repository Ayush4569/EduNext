import ChapterAccess from "@/components/ChapterAccess";
import ChapterDescriptionForm from "@/components/ChapterDescriptionForm";
import ChapterTitleForm from "@/components/ChapterTitleForm";
import ChapterVideo from "@/components/ChapterVideo";
import axios from "axios";
import { ArrowLeft, LayoutDashboard,Eye, ListCheck,Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate,Link } from "react-router-dom";

const ChapterUpdatePage = () => {
  const { courseId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const navigate = useNavigate();
  const [isValidCourseChapter, setIsValidCourseChapter] = useState(false);
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
        if (response.status === 200 && response.statusText === "OK") {
          setChapter(response.data.chapter);
          setIsValidCourseChapter(true);
        }
      } catch (error) {
        toast.error(error.response?.data.message || error.message);
        console.log(error);
      }
    };
    isValidChapter();
  }, []);

  if(!isValidCourseChapter){
    navigate(`/teacher/courses/${courseId}`)
  }
 
  const requiredFields = [
    chapter?.title,
    chapter?.video,
    chapter?.content,
  ]
   const completedFields = requiredFields.filter((field) => field);
  return (
    <div className="mt-4 p-5 h-full">
      <div>
        <Link className="flex items-center gap-x-3" to={`/teacher/courses/${courseId}`}>
        <ArrowLeft className="h-4 w-4" />
        Back to course setup 
        </Link>
      </div>
      <div className="mt-8">
        <h1 className="text-2xl font-medium my-2">Chapter Creation</h1>
        <p className="text-sm text-slate-500">
          Complete all fields ({completedFields?.length}/{requiredFields?.length})
        </p>
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
  );
};

export default ChapterUpdatePage;
