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
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStudent } from "@/context/StudentContext";
import { useInstructor } from "@/context/InstructorContext";

function StudentSignup() {
  const form = useForm({
    defaultValues: {
      fullname: {
        firstname:"",
        lastname:"",
      },
      email: "",
      password: "",
      contact:"",
    },
  });

  const navigate = useNavigate()
  const { student,setStudent } = useStudent();
  const {instructor} = useInstructor()
  if(instructor){
    return <Navigate to='/teacher/courses' replace/>
  }
  if(student){
    return <Navigate to='/dashboard' replace/>
  }
 const onSubmit = async (data) => {

  try {
    const response = await axios.post(`${import.meta.env.VITE_BASEURL}/api/v1/students/register`, data);

    if (response.status === 201) {
        navigate("/login");
      toast.success("User registered successfully");
    }
  } catch (error) {
    console.error("Signup Error:", error);

    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    toast.error(errorMessage);
  }
};

  return (
    <div className="h-screen w-full md:flex md:gap-x-4 border">
      <div className="p-10 md:w-1/2 bg-white h-screen flex flex-col">
        <h1 className="text-3xl my-4 font-serif font-semibold text-center">Create Account As Student</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="fullname.firstname"
            rules={{ required: "Firstname is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>First name</FormLabel>
                <FormControl>
                  <Input className='p-6 placeholder:text-base' placeholder="Enter your firstname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Username Field */}
          <FormField
            control={form.control}
            name="fullname.lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Last name</FormLabel>
                <FormControl>
                  <Input className='p-6 placeholder:text-base' placeholder="Enter your lastname" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Email Field */}
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
          <FormField
            control={form.control}
            name="contact"
            rules={{
              required: "Contact number is required",
              maxLength: {
                value: 15,
                message: "Contact number must be less than 15 numbers",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Contact number</FormLabel>
                <FormControl>
                  <Input
                 className={`border-2 p-6 text-lg placeholder:text-base`}
                    type="number"
                    placeholder="Enter your contact number"
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
            Register
          </Button>
          <Button
           className="w-full md:w-max text-lg p-6 bg-blue-600 text-white"
          variant="outline"
          onClick={() => navigate("/teacher/signup")}
           >
            Register as teacher
          </Button>
          </div>
        </form>
      </Form>
      <p className="text-center cursor-pointer pb-2 md:pb-0 my-4 md:mt-8 text-lg">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
      </div>
      <div className="hidden md:block md:w-1/2 h-screen ">
        <img src='/Laptop.avif' className="h-full" alt="logo" />
      </div>
    </div>
   
  );
}

export default StudentSignup;
