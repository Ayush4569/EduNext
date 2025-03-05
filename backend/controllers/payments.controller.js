import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/course.progress.js";
import { Payment } from "../models/payments.model.js";
import { Student } from "../models/student.model.js";
import { razorpayService } from "../services/razorpay.services.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Valid Amount is required" });

    const order = await razorpayService.createOrder(amount, "INR");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const isValid = await razorpayService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      const payment = await Payment.create({
        paymentId: razorpay_payment_id,
        userId: req.student._id,
      });
      if (payment) {
        const updatedCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          {
            $addToSet: {
              enrolledStudents: req.student._id,
            },
          }
        );
        updatedCourse
          ? await Student.findOneAndUpdate(
              { _id: req.student._id },
              {
                $addToSet: {
                  enrolledCourses: courseId,
                },
              }
            )
          : null;

        await CourseProgress.create({
          course: courseId,
          userId: req.student._id,
        });
        res.status(200).json({ success: true, message: "Payment successfull" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, error: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
