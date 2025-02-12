import { useRef, useState,useEffect } from "react";
import { Pencil, Loader2, VideoIcon } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

const ChapterVideo = ({  chapterId, chapterVideo,courseId,setChapter }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const fileUploadRef = useRef(null);
  const uploadChapterVideo = async (e)=>{
    const videoFile = e.target.files[0];
    const formData = new FormData();
    formData.append("video", videoFile);
    uploadedVideo && formData.append("oldVideo",uploadedVideo)
    try {
      setLoading(true);
      const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${chapterId}/uploadVideo`,
        formData,
        {
          withCredentials: true,
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      )
      if(response.status === 200 && response.statusText === "OK"){
        setChapter((chapter)=>({...chapter,video:response.data.video}))
        toast.success("Video uploaded successfully")
      }
    } catch(error){
      console.log('error uploading video',error)
      toast.error("Error uploading video")
    }
    finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    if(chapterVideo) {
      setUploadedVideo(chapterVideo.fileName)
    const getSignedUrl = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${chapterId}/signedUrl/${chapterVideo.fileName}`,{
          withCredentials:true
        })
        if(response.status === 200 && response.statusText === "OK"){
          setSignedUrl(response.data.signedUrl)
        }
      } catch (error) {
        console.log('error getting signed url',error)
      }
    }
    getSignedUrl()
  }
  return;
  }, [chapterVideo])
  
  const toggleEdit = () => setIsEditing((current) => !current);
  return (
    <div className="bg-slate-100 p-3 border rounded-md max-h-96">
      <div className="flex items-center justify-between font-medium ">
        <h2 className="text-base">Chapter video</h2>
        <Button variant="ghost" onClick={() => toggleEdit()}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <span className="text-base">Upload or edit video</span>
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (chapterVideo  ? (
          <div className="relative aspect-video">
            <video src={signedUrl} controls >
            </video>
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center bg-slate-200 rouded-md">
            <VideoIcon className="h-12 w-12 text-slate-500" />
          </div>
        ))}
      {isEditing && (
        loading ? (
          <div className="h-60 flex items-center justify-center bg-slate-200 rouded-md">
            <Loader2 className="h-12 w-12 text-slate-500 animate-spin" />
          </div>
        ) :
        <>
            <div className="h-60 bg-slate-200 rouded-md cursor-pointer">
            <input
              onChange={uploadChapterVideo}
              ref={fileUploadRef}
              type="file"
              className="hidden"
              name="coverImage"
            />
            <div
              onClick={() => fileUploadRef.current.click()}
              className="w-full h-full flex items-center justify-center cursor-pointer"
            >
            
            <div className="flex flex-col justify-center">
                <h1 className="text-xl mr-4 flex items-center gap-2"> Upload a video </h1>
                <FontAwesomeIcon className="h-10" icon={faCloudArrowUp} />
              </div>
              </div>
          </div>
            <p className="text-sm mt-2">Video may take time to process pls refresh this page after video is uploaded successfully</p>
        </>
      )}
    </div>
  );
};

export default ChapterVideo;
