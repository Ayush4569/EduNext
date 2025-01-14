import {useRef, useState} from 'react'
import { ImageIcon, Pencil } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
  import { Button } from "./ui/button";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from './ui/input';

const ImageForm = ({courseId,courseImage}) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileUploadRef = useRef(null)
  const toggleEdit = () => setIsEditing((current) => !current);
  const submitHandler = async (editedData) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/courses/editDescription/${courseId}`,
        editedData,
        { withCredentials: true }
      );
      if (response.statusText === "OK" || response.status === 200) {
        toggleEdit();
        reset();
        toast.success(response?.data?.message || "course description updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
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
              <span className="text-sm">Edit image</span>
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !courseImage  ? (
            <div className='h-60 flex items-center justify-center bg-slate-200 rouded-md'>
                <ImageIcon className='h-14 w-14 text-slate-500'/>
            </div>
        )
        :(
            <div className='relative aspect-video mt-2'>
               <img className='object-cover rounded-md' src={courseImage} />
            </div>
        )
      )}
      {isEditing && (
        <div className="mt-3">
            <form onSubmit={submitHandler} encType='multipart/form-data'>
              <div className='h-60 bg-slate-200 rouded-md cursor-pointer'>
              <Input ref={fileUploadRef} type='file' className='hidden' />
                <div onClick={()=>fileUploadRef.current.click()} className='w-full h-full flex items-center justify-center cursor-pointer'>
                  <h1 className='text-2xl mr-4'> Upload an image</h1>
                  <FontAwesomeIcon className='h-6' icon={faUpload}/>
                </div>
              </div>
              <div className='mt-4 text-xs text-muted-foreground'>16:9 ratio recommended</div>     
            </form>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
