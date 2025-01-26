import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RTE({
  onChange,
  value,
  initialValue = "write your chapter contents here",
  setEditorLoading
}) {
  return (
    <>
<Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      onInit={() => setEditorLoading(false)}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "image",
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
          "anchor",
        ],
        toolbar:
          "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      initialValue={initialValue}
    />
    </>
    
  );
}
