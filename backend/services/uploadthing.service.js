import { UploadThingError, createUploadthing } from "uploadthing/server";
import multer from "multer"
const file = createUploadthing();
const upload = multer()
export const uploadRouter = {
  attachments: file(["image", "video", "pdf"]) 
    .middleware(({ req }) => {
      console.log(req.file);
      const instructor = req.instructor;
      if (!instructor) {
        throw new UploadThingError("You must be logged in to upload attachments");
      }
      return { instructor };
    })
    .onUploadComplete(async ({ metaData }) => {
      try {
        console.log('metaDeta',metaData);
        // console.log("Uploaded by instructor:", metaData.instructor);
        // Add additional logic here, like saving the upload details to the database.
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
      }
    }),
};
export const multerMiddleware = upload.single("attachments");
