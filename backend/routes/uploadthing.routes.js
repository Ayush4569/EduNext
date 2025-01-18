import express from "express";

import { createRouteHandler } from "uploadthing/express";

import { multerMiddleware, uploadRouter } from "../services/uploadthing.service.js";
import { authInstructor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(
  "/api/uploadthing",
  authInstructor,
  multerMiddleware,
  createRouteHandler({
    router: uploadRouter,
  }),
);

export default router