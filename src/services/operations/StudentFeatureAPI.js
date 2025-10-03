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
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}


export async function BuyCourse(
  token, 
  courses, 
  userDetails, 
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
    
    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return;
  }

  // Initiating the Order in Backend
  const orderResponse = await apiConnector(
    "POST",
    COURSE_PAYMENT_API,
    {
      courses,
    },
    {
      Authorization: `Bearer ${token}`,
    }
  )


  if (!orderResponse.data.success) {
    throw new Error(orderResponse.data.message)
  }
  console.log("PAYMENT RESPONSE FROM BACKEND............", 
    orderResponse.data
  )

  // options
  const options = {
    key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
    currency: orderResponse.data.message.currency,
    amount:`${orderResponse.data.message.amount}`,
    order_id:orderResponse.data.message.id,
    name:"StudyNotion",
    description:"Thank you for purchasing the course",
    image:rzpLogo,
    prefill:{
      name:`${userDetails.firstName || ""}`,
      email:userDetails.email || "",

    },
    handler: async function(response){
      // verify payment
      await verifyPayment({...response, courses} , token, navigate, dispatch);
      
      // send successfull vala mail
      await sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token);
    }
  }

  const paymentObject = new window.Razorpay(options);

  paymentObject.open();
  paymentObject.on("payment.failed", function(response){
    toast.error("oops, payment failed")
    console.log(response.error)
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