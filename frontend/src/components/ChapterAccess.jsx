import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

const ChapterAccess = ({ courseId, setChapter, chapterId, isChapterFree }) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    defaultValues: {
      isFree: false,
    },
  });
  const toggleEdit = () => setIsEditing((current) => !current);
  const submitHandler = async (editedData) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASEURL
        }/api/v1/chapters/${courseId}/${chapterId}/editAccess`,
        editedData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setChapter((chapter) => ({ ...chapter, isFree: response.data.isFree }));
        toggleEdit();
        // reset();
        toast.success(response?.data?.message || "chapter access updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-1 border-red-50">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-base ">Chapter access</h2>
        <Button variant="ghost" onClick={() => toggleEdit()}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <span className="text-base">Edit access settings</span>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            "text-base mt-2",
            !isChapterFree && "text-slate-500 italic"
          )}
        >
          {isChapterFree
            ? "This chapter is free for preview"
            : "This chapter is not free"}
        </p>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)}>
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start p-4 rounded-md space-x-3 space-y-0 border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box to make this chapter free for preview
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 ml-2"
              >
                Save
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default ChapterAccess;
