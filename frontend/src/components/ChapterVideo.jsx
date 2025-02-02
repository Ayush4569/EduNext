import { useRef, useState,useEffect } from "react";
import { Pencil, Loader2, VideoIcon } from "lucide-react";
;

import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import MuxUploader from "./MuxUploader";
import MuxPlayer from "@mux/mux-player-react";


const ChapterVideo = ({  chapterId, chapterVideo,courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playbackId, setPlaybackId] = useState(null);

  useEffect(() => {
    const getPlaybackId = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${chapterId}`, {
          withCredentials: true,
        });
        
        if(response.statusText == 'OK' && response.data){
          setPlaybackId(response.data.chapter.video.muxPlaybackId);
        }
      } catch (fetchplaybackIdError) {
        console.log(fetchplaybackIdError);
      }
      finally{
        setLoading(false);
      }
    };

    getPlaybackId();
  }, []);
  

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
        (chapterVideo ?(
          <div className="relative aspect-video">
            <MuxPlayer playbackId={playbackId} autoPlay  />
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center bg-slate-200 rouded-md">
            <VideoIcon className="h-12 w-12 text-slate-500" />
          </div>
        ))}
      {isEditing && (
        <div>
            <MuxUploader
            chapterId={chapterId}
            />
            <p className="text-sm mt-2">Video may take time to process pls refresh this page after video is uploaded successfully</p>

        </div>
      )}
    </div>
  );
};

export default ChapterVideo;
