import React from "react";
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
} from "../components/ui/form";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import toast from "react-hot-toast";
import { useInstructor } from "@/context/InstructorContext";

function StudentLogin() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { student,setStudent } = useStudent();
  const {instructor} = useInstructor()
  if(instructor){
    return <Navigate to='/teacher/courses' replace/>
  }
  if(student){
    return <Navigate to='/dashboard' replace/>
  }


  const onSubmit = async (data) => {
    const apiEndpoint = `${import.meta.env.VITE_BASEURL}/api/v1/students/login`;
    try {
      const response = await axios.post(apiEndpoint, data);
      console.log("login response", response);
      if (response.status === 200) {
        setStudent(response.data);
        navigate("/dashboard");
        toast.success("Login successfull");
      }
    } catch (error) {
      console.log("login error", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div className="h-screen w-full md:flex md:gap-x-4 border">
      <div className="p-10  md:w-1/2 bg-white h-screen flex flex-col justify-center">
        <h1 className="text-xl md:text-3xl my-4 font-serif font-semibold text-center">Login into your account as student</h1>
        <h1 className="text-xl animate-pulse  transition-all md:text-2xl my-4 font-serif font-semibold text-purple-800 text-center"> Welcome back login with your credentials to start using EduNext</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Please enter a valid email",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Email</FormLabel>
                <FormControl>
                  <Input className={`border-2 p-6 text-lg placeholder:text-base`}  type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Password</FormLabel>
                <FormControl>
                  <Input
                 className={`border-2 p-6 text-lg placeholder:text-base`}
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:flex w-full md:justify-between md:items-center">
          <Button type="submit"
           className="w-full mb-2 md:mb-0 md:w-max text-lg p-6 hover:bg-yellow-400 hover:text-black transition-all"
           >
            Login
          </Button>
          <Button
           className="w-full md:w-max text-lg p-6 bg-blue-600 text-white"
          variant="outline"
          onClick={() => navigate("/teacher/login")}
           >
            Login as teacher
          </Button>
          </div>
        </form>
      </Form>
      <p className="text-center cursor-pointer pb-2 md:pb-0 my-4 md:mt-8 text-lg">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
          </p>
      </div>
      <div className="hidden md:flex md:items-center bg-[#f8f8f8] md:w-1/2 h-screen ">
        <img src='/login.png' alt="logo" />
      </div>
    </div>
  );
}

export default StudentLogin;
