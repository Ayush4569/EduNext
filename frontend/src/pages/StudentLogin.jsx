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
import { useNavigate,Link } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import toast from "react-hot-toast";

function StudentLogin() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate()
  const {setStudent} = useStudent()

  const onSubmit = async(data) => {

    console.log("Form Data:", data);
    const apiEndpoint =`${import.meta.env.VITE_BASEURL}/students/login`
    try {

      const response = await axios.post(apiEndpoint,data)
      if(response.statusText === 'OK'){
          setStudent(response.data)
          navigate('/')
     
     
        toast.success("Login successfull")
      }
     } catch (error) {
      console.log('login error',error);
      toast.error(error?.response?.data?.message || error.message)
     }
    console.log("Form Data:", data);
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
       <div className="p-8 w-[32%] mx-auto bg-gray-50 rounded-lg h-auto shadow-xl ">
      <h1 className="text-3xl font-semibold mb-4 text-center text-red-500">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 text-lg text-white p-6">
            Login
          </Button>
        </form>
      </Form>
      <div className="mt-6">
        <Link to='/teacher/login' className="text-lg text-red-600 underline">Login as Instructor </Link>
      </div>
    </div>
    </div>
   
  );
}

export default StudentLogin;
