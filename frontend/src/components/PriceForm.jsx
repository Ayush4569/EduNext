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
import { Input } from "./ui/input";
import { cn } from '@/lib/utils';

const PriceForm = ({courseId,coursePrice,setCourse}) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm({
        defaultValues: {
          price: 0,
        },
      });
      const { isValid,isSubmitting} = form.formState;
      const { reset} = form;
      const toggleEdit = ()=> setIsEditing((current)=> !current)
       function convertToInr(price){
         return new Intl.NumberFormat('en-US',{style:'currency',currency:'INR'}).format(price)
      }
      const submitHandler = async(editedData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BASEURL}/api/v1/courses/${courseId}/editPrice`,editedData,{withCredentials:true})
            if( response.status === 200){
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
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-1 border-red-50">
    <div className="flex items-center justify-between font-medium">
      <h2 className="text-base ">Course price</h2>
      <Button
        variant="ghost"
        onClick={()=>toggleEdit()}
      >
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <Pencil className="h-4 w-4" />
            <span className="text-base">Edit price</span>
          </>
        )}
      </Button>
    </div>
    {!isEditing ? (
      <p className={cn('text-base mt-2',!coursePrice && "text-slate-500 italic")}>
        {
            coursePrice ? (
                convertToInr(coursePrice)
            ) : "Free"
        }
      </p>
    ) : (
      <div className="mt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
              control={form.control}
              name="price"
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                            disabled={isSubmitting}
                            type="number"
                            placeholder="e.g. ₹999"
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

export default PriceForm