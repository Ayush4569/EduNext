import { useState } from "react";
import { Pencil } from "lucide-react";
import { Form, FormField, FormControl, FormMessage, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import toast from "react-hot-toast";

const ChapterTitleForm = ({
  chapterTitle,
  courseId,
  setChapter,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const { reset } = form;
  const toggleEdit = () => setIsEditing((current) => !current);
  const submitHandler = async (editedData) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASEURL
        }/api/v1/chapters/${courseId}/${chapterId}/editTitle`,
        editedData,
        { withCredentials: true }
      );
      if (response.statusText === "OK" || response.status === 200) {
        setChapter((prev) => ({ ...prev, title: response.data.title }));
        toggleEdit();
        reset();
        toast.success(response?.data?.message || "chapter title updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-4">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-base ">Chapter title</h2>
        <Button variant="ghost" onClick={() => toggleEdit()}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <span className="text-base">Edit title</span>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p>{chapterTitle}</p>
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
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Quantum physics"
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
  );
};

export default ChapterTitleForm;
