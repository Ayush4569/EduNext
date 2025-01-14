import { validationResult } from "express-validator";
import {Course} from "../models/course.model.js"

const createCourse = async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const {title} = req.body;
  const newCourse = new Course({title,author:req.instructor._id})
  await newCourse.save()
  return res.status(200).json(newCourse)
}
const getCourseById = async(req,res)=>{
  const {courseId} = req.params
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const course = await Course.findById(courseId)
  if(!course){
    return res.status(400).json({ message:"No such course exists" });
  }
  return res.status(200).json(course)
}
const updateCourseTitle = async(req,res)=>{
  const {title} = req.body;
  const {courseId} = req.params
  if(!courseId){
    return res.status(200).json({message:"No such course exists"})
  }
  try {
    await Course.findByIdAndUpdate(courseId,{title})
    return res.status(200).json({message:"course title updated"})
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({
      message: 'Failed to update title ',
  })
}
}
const updateCourseDescription = async(req,res)=>{
  const {description} = req.body;
  const {courseId} = req.params
  if(!courseId){
    return res.status(200).json({message:"No such course exists"})
  }
  try {
    await Course.findByIdAndUpdate(courseId,{description})
    return res.status(200).json({message:"course description updated"})
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({
      message: 'Failed to update description ',
  })
}
}


export {
  createCourse,
  getCourseById,
  updateCourseTitle,
  updateCourseDescription
}