import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChapterContent = () => {
  const { chapterId, courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCourse = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`,
          {
            withCredentials:true
          }
        );
        if (response.status === 200 && response.statusText === "OK") {
          setCourse(response.data.course);
        }
      } catch (error) {
        console.log("Get course error", error);
      }
      finally{
        setLoading(false);
      }
    };
    getCourse();
  }, [courseId]);

  if(loading){
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-700" size={100}/>
      </div>
    );
  }

 if(course){
    const chapter = course.chapters.find((chapter) => chapter._id === chapterId);
    if (!chapter) {
      throw new Error("Some thing went wrong chapter not found");
    }
    const courseProgress = course?.courseProgress;
    return <div></div>;
 }
}

export default ChapterContent;
