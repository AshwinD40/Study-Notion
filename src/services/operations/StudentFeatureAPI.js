import toast from "react-hot-toast";

import rzpLogo from "../../assets/Logo/rzp_logo.jpg"
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice";

const {
  COURSE_PAYMENT_API, 
  COURSE_VERIFY_API , 
  SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    }
    document.body.appendChild(script);
  });
}

// Buy Course
export async function BuyCourse(
  token, 
  courses, 
  user_details, 
  navigate, 
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try{
    // Guards
    if (!token) {
    toast.error("You must be logged in as a Student to purchase.");
    return;
    }
    if (!Array.isArray(courses) || courses.length === 0) {
    toast.error("No course selected.");
    return;
    }

    // load script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res || !window.Razorpay) {
      toast.error( "Razorpay SDK failed to load. Check your Internet Connection." )
      return;
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Could not create order");
    }
    console.log("PAYMENT RESPONSE FROM BACKEND............", 
      orderResponse.data
    );

    const clientKey = orderResponse.data.key || process.env.REACT_APP_RAZORPAY_KEY;
    if(!clientKey){
      console.log("Missing Razorpay client key on frontend");
      toast.error("Payment config missing. Contactr support");
      return;
    }

    const order = orderResponse.data.message;
    const amountValue = Number(order.amount);
    if(!Number.isFinite(amountValue)){
      console.log("Invalid order.amount from be", order.amount);
      toast.error("Payment config missing. Contactr support");
      return;
    }
    const options = {
      key: clientKey,
      amount: amountValue,
      currency: order.currency || "INR",
      order_id: order.id,
      name: "StudyNotion",
      description: "Thank you for purchasing the course",
      image: rzpLogo,
      prefill: {
        name: `${user_details?.firstName || ""} ${user_details?.lastName || ""}`,
        email: user_details?.email || "",
      },
      handler: function (response) {
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
        sendPaymentSuccessEmail(response, amountValue, token);
      },
    };

    console.log("Initializing Razorpay with options:", { ...options, key: "REDATECTED"});

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
    paymentObject.on("payment.failed", function(response){
      toast.error("oops, payment failed")
      console.log("razorpay payment failed",  response.error)
    })
                  
  }catch(error){
    console.log("PAYMENT API ERROR",error?.response || error);
    toast.error( error?.response?.data?.message || "Could not make Payment");
  } finally{
    toast.dismiss(toastId)
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try{
    await apiConnector(
      "POST", 
      SEND_PAYMENT_SUCCESS_EMAIL_API, 
      {
        orderId:response.razorpay_order_id,
        paymentId:response.razorpay_payment_id,
        amount
      },
      {
        Authorization: `Bearer ${token}`
      }
    )
  }catch(error){
    console.log("PAYMENT_SUCCESS_EMAIL ERROR", error);
  }
}

async function verifyPayment (bodyData, token , navigate, dispatch) {
    
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true))
  
  try{    
    const response = await apiConnector(
      "POST", 
      COURSE_VERIFY_API, 
      bodyData, 
      {
        Authorization: `Bearer ${token}`
      }
    );
    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if(!response?.data?.success){
      throw new Error(response?.data?.message || "Payment verification failed");
    }
    toast.success("Payment Successfull, You are enrolled!");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());

  }catch(error){
    console.log("PAYMENT VERIFY ERROR",error?.response || error)
    toast.error(error?.response?.data?.message || "Could not verify payment")
  } finally{
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false));
  }

}