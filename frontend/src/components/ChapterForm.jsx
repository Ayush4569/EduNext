import {useState} from 'react'
import { PlusCircle, Grip, Pencil } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

import ChapterList from './ChapterList';

const ChapterForm = ({courseChapters,courseId,setCourse}) => {
  console.log(courseChapters);
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm({
        defaultValues: {
          title: "",
        },
      });
      const { isValid,isSubmitting} = form.formState;
      const { reset } = form;
      const toggleEdit = ()=> setIsEditing((current)=> !current)
      const submitHandler = async(editedData) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/courses/${courseId}/chapters`,editedData,{withCredentials:true})
            if(response.statusText === "OK" || response.status === 200){
              setCourse((prev)=>({...prev,chapters:response.data.chapter}))
                toggleEdit()
                reset()
                toast.success(response?.data?.message || 'course description updated')
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
        }
      };
    
  return (
    <div>
         <div className="bg-slate-100 p-4 border rounded-md mt-6">
    <div className="flex items-center justify-between font-medium mb-2">
      <h2 className="text-base ">Course chapters</h2>
      <Button
        variant="ghost"
        onClick={()=>toggleEdit()}
      >
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <PlusCircle className="h-6 w-6" />
            <span className="text-base">Add a chapter</span>
          </>
        )}
      </Button>
    </div>
    {!isEditing ? (
        <>
        {!isEditing && (  
       courseChapters?.length>0 ? (
        <ChapterList items={courseChapters}/>
            ) :   <p className={cn('text-base mt-2',!courseChapters?.length>0 && "text-slate-500 italic")}>No chapters</p>
        )} 
        <p className='text-gray-500 mt-2 text-base'>Drag and drop to reorder chapters</p>
        </>
      
    ) : (
      <div className="mt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                   <Input disabled={isSubmitting} placeholder='e.g Introduction to this course' {...field}/>
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
              Create
            </Button>
          </form>
        </Form>
      </div>
    )}
  </div>
    </div>
  )
}

export default ChapterForm