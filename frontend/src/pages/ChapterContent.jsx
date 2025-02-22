import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, File } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import HTMLReactParser from "html-react-parser";

const ChapterContent = () => {
  const { chapterId, courseId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
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
          // try {
          //   const res = await axios.get(
          //     `${
          //       import.meta.env.VITE_BASEURL
          //     }/api/v1/chapters/${courseId}/${chapterId}/signedUrl/${
          //       response.data.chapter.video.fileName
          //     }`,
          //     { withCredentials: true }
          //   );
          //   if (res.status === 200 && res.statusText === "OK") {
          //     setChapter({
          //       ...response.data.chapter,
          //       videoUrl: res.data.signedUrl,
          //     });
          //   }
          // } catch (error) {
          //   console.log("Get signed url error", error);
          // }
          setChapter(response.data.chapter);
        }
      } catch (error) {
        toast.error(error?.response.data.message || "Error getting chapter");
        console.log("Get chapter error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [chapterId, courseId]);
  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}`,
          { withCredentials: true }
        );
        if (response.status === 200 && response.statusText === "OK") {
          setCourse(response.data.course);
        }
      } catch (error) {
        console.log("Get course error", error);
      }
    };
    getCourse();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-700" size={100} />
      </div>
    );
  }
  // const courseProgress = course?.courseProgress;
  if (chapter && course) {
    return (
      <div className="w-full h-auto pt-8">
        <div className="flex flex-col h-full w-[60vw] m-auto">
          <div className="h-max pb-4 flex flex-col gap-y-8 border-b w-full">
            <video
              src={"/video.mov"}
              className="h-full w-full"
              controls
              muted
            />
            <div className="flex w-full items-center justify-between">
              <h1 className="md:text-2xl text-xl font-semibold">
                {chapter?.title}
              </h1>
              <Button className="bg-green-600/90">
                Mark as complete <CheckCircle />
              </Button>
            </div>
          </div>
          <div className="h-auto w-full p-2 pl-0">
            <div className="border-b p-2 pl-0">
              <h2 className="text-lg">Objectives:</h2>
              <p className="text-lg">{HTMLReactParser(chapter?.content)}</p>
            </div>
            <div className="p-3 pl-0 border-b">
              <h2 className="text-lg">Attachments:</h2>
              {course?.attachments?.map((attachment) => (
                <div
                  key={attachment._id}
                  className="flex cursor-pointer items-center p-3 w-full bg-sky-100 border-sky-200 border overflow-scroll text-sky-700 rounded-md mt-2"
                >
                  <File className="h-6 w-6 mr-2 flex-shrink-0" />
                  <span
                    onClick={() => {
                      window.open(attachment.attachment, "_blank");
                    }}
                    className="text-base w-full line-clamp-1"
                  >
                    {attachment.attachmentName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ChapterContent;
