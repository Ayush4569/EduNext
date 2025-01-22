import {useState} from 'react'
import { Pencil } from 'lucide-react';
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
import Options from './ui/options';

const CategoryForm = ({setCourse,courseCategory,courseId}) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm({
        defaultValues: {
          category: "",
        },
      });
      const { isValid,isSubmitting} = form.formState;
      const { reset} = form;
      const toggleEdit = ()=> setIsEditing((current)=> !current)
      const submitHandler = async(editedData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/courses/editCategory/${courseId}`,editedData,{withCredentials:true})
            if(response.statusText === "OK" || response.status === 200){
              setCourse((prev)=>({...prev,category:response.data.category}))
                toggleEdit()
                reset()
                toast.success(response?.data?.message || 'course category updated')
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message)
        }
      }
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-6">
    <div className="flex items-center justify-between font-medium">
      <h2 className="text-base ">Course category</h2>
      <Button
        variant="ghost"
        onClick={()=>toggleEdit()}
      >
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <Pencil className="h-4 w-4" />
            <span className="text-base">Edit category</span>
          </>
        )}
      </Button>
    </div>
    {!isEditing ? (
      <p className={cn('text-base mt-2',!courseCategory && "text-slate-500 italic")}>{courseCategory || "No category selected"}</p>
    ) : (
      <div className="mt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                   <Options field={field}/>
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

export default CategoryForm