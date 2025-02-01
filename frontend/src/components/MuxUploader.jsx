import React, { useEffect, useState } from "react";
import MuxUpload from "@mux/mux-uploader-react";
import axios from "axios";
import toast from "react-hot-toast";
const MuxUploader = ({ chapterId, playbackId = null }) => {
  const [uploadUrl, setUploadUrl] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/mux/${chapterId}/generate-mux-url`,
          {
            withCredentials: true,
          }
        );
        setUploadUrl(response.data.uploadUrl);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {!playbackId ? (
        <MuxUpload
          className="h-full w-full"
          endpoint={uploadUrl}
          pausable
          onUploadError={(event) => {
            toast.error("Video uploadfailed");
          }}
          onSuccess={(event) => {
            toast.success("Video uploaded successfully");
          }}
        />
      ) : (
        <>No playback id</>
      )}
    </>
  );
};

export default MuxUploader;
