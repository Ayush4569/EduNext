import React from 'react'
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../components/ui/form";
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-hot-toast"
import axios from 'axios';
const CreateCourses = () => {
    const form = useForm({
        defaultValues:{
            title:''
        }
    })
    const {isValid,isSubmitting,isValidating} = form.formState
    const navigate = useNavigate()
    const submitHandler = async(data)=>{
       try {
        const res = await axios.post(`${import.meta.env.VITE_BASEURL}/api/v1/courses/create`,data,{withCredentials:true})
        if(res.statusText == 'OK'){
           navigate(`/teacher/courses/${res.data._id}`)
           toast.success("Course created")
        }
       } catch (error) {
        console.log('error',error);
        toast.error(error?.response?.data?.message || error.message)
       }
    }
  return (
    <div className='max-w-5xl mx-auto p-6 h-full flex md:items-center md:justify-center'>
        <div> <h2 className='text-2xl'>Name of your course</h2>
        <p className='text-sm text-slate-600'>
            What would you like to name this course? Don&apos;t, worry you can change this later
        </p>
       <Form {...form}>
        <form className='space-y-8 mt-8' onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
            control = {form.control}
            name = 'title'
            rules={{ required: "Course title is required" }}
            render = {({field})=>(
                <FormItem>
                <FormLabel >Course title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your course name" {...field} />
                </FormControl>
                <FormDescription>
                   What will you teach in this course? e.g.  'Computer Networks and Web 3.0'
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />
            <div className='flex items-center gap-3'>
             <Link to='/'>
             <Button type='button' variant = 'destructive'>
                Cancel
             </Button>
             </Link>
             <Button disabled = {!isValid || isSubmitting || isValidating} type = 'submit'>Continue</Button>
            </div>
        </form>
       </Form>
       </div>
       
    </div>
  )
}

export default CreateCourses