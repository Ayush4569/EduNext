import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const upload = multer({ storage: storage });
