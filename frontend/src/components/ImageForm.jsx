import { useRef, useState } from "react";
import { ImageIcon, Pencil,Loader2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const ImageForm = ({ courseId, courseImage,setCourse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading,setLoading] = useState(false)

  const fileUploadRef = useRef(null);
  const toggleEdit = () => setIsEditing((current) => !current);
  const submitHandler = async (e) => {
    const formData = new FormData();
    formData.append("coverImage", e.target.files[0]);
    try {
      setLoading(true)
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}/editCoverImage`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-type": "multipart/form-data" },
        }
      );
      if ( response.status === 200) {
       setCourse((prev)=>({...prev,coverImage:response.data.url}))
        toggleEdit();
        toast.success(response?.data?.message || "course image updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
    finally{
      setLoading(false)
    }
  };
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-6 max-h-96">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-base ">Course Image</h2>
        <Button variant="ghost" onClick={() => toggleEdit()}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <span className="text-base">Edit image</span>
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (courseImage ? (
          <div className="relative aspect-video">
            <img className="object-cover rounded-md h-full w-full" src={courseImage} />
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center bg-slate-200 rouded-md">
            <ImageIcon className="h-14 w-14 text-slate-500" />
          </div>
        ))}
      {isEditing && (
        <div className="mt-3">
          {loading ? (
           <div className="h-60 flex items-center justify-center">
            <Loader2 className="h-14 w-14 animate-spin text-cyan-700"/>
           </div>
          ):
          (
            <>
            <div className="h-60 bg-slate-200 rouded-md cursor-pointer">
            <input
              onChange={submitHandler}
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
                <h1 className="text-xl mr-4 flex items-center gap-2"> Upload an image <span className="text-blue-600 text-lg">(max 10mb)</span></h1>
                <FontAwesomeIcon className="h-10" icon={faCloudArrowUp} />
              </div>
            </div>
          </div>
            </>
          )}
          <div className="mt-4 text-md text-muted-foreground">
            16:9 ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
