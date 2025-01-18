import {useState} from 'react'
import { File, Pencil,X } from 'lucide-react';
import {
    Form,
    FormField,
    FormControl,
    FormMessage,
    FormItem,
  } from "./ui/form";
  import { useForm } from "react-hook-form";
  import { Button } from "./ui/button";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from "./ui/input";
import { cn } from '@/lib/utils';

const AttachmentsForm = ({courseId,courseAttachments,setCourse}) => {
  console.log(courseAttachments);
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm({
        defaultValues: {
          price: 0,
        },
      });
      const { isValid,isSubmitting} = form.formState;
      const { reset} = form;
      const toggleEdit = ()=> setIsEditing((current)=> !current)
      const submitHandler = async(editedData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/courses/editPrice/${courseId}`,editedData,{withCredentials:true})
            if(response.statusText === "OK" || response.status === 200){
              setCourse((prev)=>({...prev,price:response.data.price}))
                toggleEdit()
                reset()
                toast.success(response?.data?.message || 'course price updated')
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
        }
      };
      const deleteAttachment = async(attachmentId)=>{
       try {
        
       } catch (error) {
        
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
            <Pencil className="h-4 w-4" />
            <span className="text-sm">Edit attachments</span>
          </>
        )}
      </Button>
    </div>
    {!isEditing ? (
      <>
        
      <div>
       {
            courseAttachments?.length>0 ? (
                courseAttachments.map((attachment,id)=>(
                   <div key={id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md mt-2'>
                    <File className='h-4 w-4 mr-2 flex-shrink-0'/>
                    <p className='text-xs line-clamp-1'>{attachment}</p>
                     <button onClick={()=>deleteAttachment()} className='ml-auto hover:opacity-75 transition'>
                     <X className='h-4 w-4'/>
                     </button>
                   </div> 
                ))
            ) :   <p className={cn('text-sm mt-2',!courseAttachments?.length>0 && "text-slate-500 italic")}>No attachments</p>
        }
    
      </div>
      </>
  
       
    ) : (
      <div className="mt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
              control={form.control}
              name="price"
              rules={{ required: "Attachments are required" }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                            disabled={isSubmitting}
                            type="number"
                            placeholder="e.g. $49"
                            {...field}
                          />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 ml-2"
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    )}
  </div>
  )
}

export default AttachmentsForm