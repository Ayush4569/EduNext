import {useState,useRef} from 'react'
import { File,X,PlusCircle } from 'lucide-react';
import { Button } from "./ui/button";
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { ProgressBar } from 'react-loader-spinner';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AttachmentsForm = ({courseId,courseAttachments,setCourse}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading,setLoading] = useState(false)

  const fileUploadRef = useRef(null);
  const toggleEdit = () => setIsEditing((current) => !current);

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
     formData.append('attachments',e.target.files[i])
    }
    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/v1/attachments/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-type": "multipart/form-data" },
        }
      );
      if (response.statusText === "OK" || response.status === 200) {
       setCourse((prev)=>({...prev,attachments:response.data.attachments}))
        toggleEdit();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
    finally{
      setLoading(false)
    }
  };
      const deleteAttachment = async(attachmentId)=>{
       try {
        const response = await axios.delete(`${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/${attachmentId}`)
        if(response.statusText === 'OK' && response.status === 200){
          setCourse((prev)=>({...prev,attachments:response.data.attachments}))
          toast.success(response.data.message || 'Attachment removed')
        }
       } catch (error) {
        toast.error(error.response?.data?.message || error.message)
        console.log(error);
       }
      }
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-6 border-red-50">
    <div className="flex items-center justify-between font-medium">
      <h2 className="text-base ">Course attachments</h2>
      <Button
        variant="ghost"
        onClick={()=>toggleEdit()}
      >
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <PlusCircle className="h-6 w-6" />
            <span className="text-sm">Add attachments</span>
          </>
        )}
      </Button>
    </div>
    {!isEditing && (  
        <>
       {
            courseAttachments?.length>0 ? (
                courseAttachments.map((attachment)=>(
                   <div key={attachment._id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border overflow-scroll text-sky-700 rounded-md mt-2'>
                    <File className='h-4 w-4 mr-2 flex-shrink-0'/>
                    <p onClick={()=>{window.open(attachment.attachment,"_blank")}} className='text-xs line-clamp-1 cursor-pointer'>{attachment.attachmentName}</p>
                     <button onClick={()=>deleteAttachment(attachment._id)} className='ml-auto hover:opacity-75 transition'>
                     <X className='h-4 w-4 ml-4'/>
                     </button>
                   </div> 
                ))
            ) :   <p className={cn('text-base mt-2',!courseAttachments?.length>0 && "text-slate-500 italic")}>No attachments</p>
        }
      </>
    )} 
     {isEditing && (
      <div className="mt-3">
        {loading ? (
         <div className="h-60 flex items-center justify-center">
          <ProgressBar height={120} width={120}/>
         </div>
        ):
        (
          <>
          <div className="h-60 bg-slate-200 rouded-md cursor-pointer">
          <input
            onChange={submitHandler}
            ref={fileUploadRef}
            multiple
            type="file"
            className="hidden"
            name="attachMents"
          />
          <div
            onClick={() => fileUploadRef.current.click()}
            className="w-full h-full flex items-center justify-center cursor-pointer"
          >
            <div className="flex flex-col justify-center">
              <h1 className="text-xl mr-4 flex items-center gap-2"> Upload an attachment</h1>
              <FontAwesomeIcon className="h-10" icon={faCloudArrowUp} />
            </div>
          </div>
        </div>
          </>
        )}
        <div className="mt-4 italic text-md text-muted-foreground">
           upload anything that might be useful for your students
          </div>
      </div>
    )}
  </div>
  )
}

export default AttachmentsForm