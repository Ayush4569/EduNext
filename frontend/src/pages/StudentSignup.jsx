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
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStudent } from "@/context/StudentContext";

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
      role:""
    },
  });

  const navigate = useNavigate()
 const {setStudent} = useStudent()
 const onSubmit = async (data) => {
  console.log("Form Data:", data);

  const apiEndpoint = `${import.meta.env.VITE_BASEURL}/students/register`

  try {
    const response = await axios.post(apiEndpoint, data);

    if (response.status === 201) {
        setStudent(response.data);
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
    <div className="h-screen w-screen flex items-center justify-center">
       <div className=" p-8 w-[32%] mx-auto bg-gray-50 rounded-lg h-auto shadow-xl ">
      <h1 className="text-3xl font-semibold mb-4 text-center text-red-500">Signup</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="fullname.firstname"
            rules={{ required: "Firstname is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Firstname</FormLabel>
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
                <FormLabel className='text-lg'>Lastname</FormLabel>
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


          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 text-lg text-white p-6">
            Register
          </Button>
        </form>
      </Form>
      <div>
        <h2 className="text-lg mt-4">Already have an accoun't ? <Link className="text-blue-800 underline" to='/login'>Login</Link></h2>
      </div>
    </div>
    </div>
   
  );
}

export default StudentSignup;
