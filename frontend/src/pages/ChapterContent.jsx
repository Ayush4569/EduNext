import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, File, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import HTMLReactParser from "html-react-parser";
import AlertBanner from "@/components/ui/AlertBanner";
import VideoPlayer from "@/components/VideoPlayer";
import PaymentButton from "@/components/PayButton";
import ConfettiComponent from "@/components/Confetti";
import { cn } from "@/lib/utils";
const ChapterContent = () => {
  const { course, setCourse } = useOutletContext();
  const { chapterId, courseId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animateConfetti, setAnimateConfetti] = useState(false);
  const navigate = useNavigate();

  const [isConfettiShown, setIsConfettiShown] = useState(() => 
    JSON.parse(localStorage.getItem("isConfettiShown") || "false")
  );
  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${chapterId}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setChapter(response.data.chapter);
        }
      } catch (error) {
        toast.error(error?.response?.data.message || "Error getting chapter");
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [chapterId, courseId]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-700" size={100} />
      </div>
    );
  }

  if (!chapter || !course) return null;

  const isLocked = !course.isEnrolled && !chapter.isFree;
  const isChapterCompleted = course.courseProgress?.completedChapter?.includes(chapterId);

  const handleChapterComplete = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/v1/course-progress/${courseId}/${chapterId}/markComplete`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data?.message || "Chapter completed");

        setCourse((prev) => ({
          ...prev,
          courseProgress: {
            completedChapter: response.data.courseProgress.completedChapter,
            progressPercentage: response.data.courseProgress.progressPercentage,
          },
        }));

       
        if (
          response.data.courseProgress.progressPercentage === 100 &&
          !isConfettiShown
        ) {
          setAnimateConfetti(true);
          setIsConfettiShown(true);
          localStorage.setItem("isConfettiShown", JSON.stringify(true));
        }
        else if(response.data.courseProgress.progressPercentage !== 100){
          localStorage.setItem("isConfettiShown", JSON.stringify(false));
        }

        if (response.data.nextChapter) {
          navigate(`/courses/${courseId}/chapters/${response.data.nextChapter}`, {
            replace: true,
          });
        }
      }
    } catch (error) {
      toast.error("Error completing chapter");
    }
  };

  const handleChapterIncomplete = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/v1/course-progress/${courseId}/${chapterId}/markIncomplete`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data?.message || "Chapter marked as incomplete");

        setCourse((prev) => ({
          ...prev,
          courseProgress: {
            completedChapter: response.data.courseProgress.completedChapter,
            progressPercentage: response.data.courseProgress.progressPercentage,
          },
        }));
      }
    } catch (error) {
      toast.error("Error marking chapter incomplete");
    }
  };

  return (
    <>
      {animateConfetti && <ConfettiComponent />}
      
      {isChapterCompleted && <AlertBanner variant="success" label="You have already completed this chapter" />}
      {isLocked && <AlertBanner variant="warning" label="You need to purchase this course to view this chapter" />}
      
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            isChapterCompleted={isChapterCompleted}
            chapterId={chapterId}
            setIsConfettiShown={setIsConfettiShown}
            setAnimateConfetti={setAnimateConfetti}
            isConfettiShown={isConfettiShown}
            courseId={courseId}
            setCourse={setCourse}
            videoUrl="/video.mov"
            isLocked={isLocked}
          />
        </div>

        <div>
          <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {course.isEnrolled ? (
              <Button
              onClick={isChapterCompleted ? handleChapterIncomplete : handleChapterComplete}
              className={cn("w-full mt-2 md:mt-0 md:w-auto",isChapterCompleted && "bg-cyan-700 text-white")}
              variant={!isChapterCompleted ? "success" : null}

              >
                {isChapterCompleted ? <>
                  Mark as incomplete <XCircle className="h-4 w-4 ml-2" />
                </>:<>
                Mark as complete <CheckCircle className="h-4 w-4 ml-2" />
                </>}
              </Button>
            ) : (
              <PaymentButton
                text={`Purchase for ${new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "INR",
                }).format(course.price)}`}
                amount={course.price}
                courseId={courseId}
              />
            )}
          </div>

          <div className="p-4 border-b">
            <h2 className="text-lg">Objectives:</h2>
            {HTMLReactParser(chapter?.content || null)}
          </div>

          {course?.attachments?.length > 0 && !isLocked && course.isEnrolled && (
            <div className="p-4">
              {course.attachments.map((att) => (
                <a
                  href={att.attachment}
                  target="_blank"
                  key={att._id}
                  className="flex cursor-pointer gap-x-2 items-center p-3 w-full bg-sky-100 border text-sky-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{att.attachmentName}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterContent;
