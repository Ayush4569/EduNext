import { useState } from "react";
import { Pencil,Loader2 } from "lucide-react";
import { Form, FormField, FormControl, FormMessage, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import RTE from "./ui/RTE";
import parse from "html-react-parser"

const ChapterDescriptionForm = ({
  chapterDescription,
  courseId,
  setChapter,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editorLoading, setEditorLoading] = useState(true);
  const form = useForm({
    defaultValues: {
      content: "",
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
        }/api/v1/chapters/${courseId}/${chapterId}/editDescription`,
        editedData,
        { withCredentials: true }
      );
      if ( response.status === 200) {
        setChapter((prev) => ({
          ...prev,
          content: response.data.content,
        }));
        toggleEdit();
        reset();
        toast.success(response?.data?.message || "chapter content updated");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  return (
    <div className="bg-slate-100 p-4 border rounded-md mt-6">
      <div className="flex items-center justify-between font-medium">
        <h2 className="text-base ">Chapter description</h2>
        <Button variant="ghost" onClick={() => toggleEdit()}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <span className="text-base">Edit description</span>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        chapterDescription ? (
          <div className="mt-2 w-full">
              {parse(chapterDescription)}
          </div>
        ) : (
         <p className="text-base text-slate-500 text-italic mt-2">No description</p>
        )
      ) : (
        <div className="relative mt-3 w-full">
          {editorLoading && (
             <div className="w-full absolute top-0 right-0 h-full flex items-center justify-center bg-slate-500/20 rounded-md">
             <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
           </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)}>
              <FormField
                control={form.control}
                name="content"
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RTE setEditorLoading={setEditorLoading} value={field.value} onChange={field.onChange} initialValue={chapterDescription}/>
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

export default ChapterDescriptionForm;
