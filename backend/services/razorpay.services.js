import Razorpay from "razorpay";
import crypto from "crypto";

class RazorpayService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  async createOrder(amount, currency = "INR") {
    try {
      const order = await this.razorpay.orders.create({
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      });
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
      return expectedSignature === razorpaySignature;
    } catch (error) {
      return false;
    }
  }
}

export const razorpayService = new RazorpayService();
