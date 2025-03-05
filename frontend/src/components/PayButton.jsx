import {  useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import {useStudent} from "@/context/StudentContext"
const PaymentButton = ({ amount, text,courseId }) => {
  const {student} = useStudent()
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
 

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/v1/payments/create-order`,
        { amount },{
          headers:{
            'Content-Type':'application/json',
          }
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "EduNext",
        description: "Course Purchase",
        order_id: response.data.id,
        handler: async function (res) {
          console.log('response', res);
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_BASEURL}/api/v1/payments/verify-payment`,
            {...res,courseId}
          );
          if (verifyRes.data.success) {
            toast.success("Payment successful!");
            window.location.reload();
          } else {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: student?.fullname.firstname,
          email: student?.email,
          contact: student?.contact,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error: ", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? "Loading..." : text}
    </Button>
  );
};

export default PaymentButton;
