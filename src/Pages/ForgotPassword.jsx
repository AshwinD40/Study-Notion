import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';
import { FaArrowLeftLong } from "react-icons/fa6";

const ForgotPassword = () => {

    const [emailSent , setEmailSent] = useState(false);
    const [email , setEmail] = useState("");
    const {loading} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent))
    }
  return (
    <div className=' flex flex-col justify-center items-center text-white mt-40'>
        {
            loading ? (
                <></>
            ) : (
                <div className=' flex flex-col gap-6 h-[500px] w-[360px]'>
                    <h1 className=' text-3xl font-bold '>
                        {
                            !emailSent ? "Reset your password" : "Check your Email"
                        }
                    </h1>
                    <p className='text-md text-richblack-300 mb-2'>
                        {
                            !emailSent 
                            ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                            : `We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit} 
                    className='flex flex-col gap-4'>
                        {
                            !emailSent && (
                                <label className='flex flex-col gap-1 mb-6'>
                                    <p className=' text-[13px] font-semibold text-richblack-100'>Email Address<span className='text-pink-300 pl-1 text-sm'>*</span></p>
                                    <input
                                    required
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter Your Email Address :'
                                    className='w-full h-11 rounded-md px-3 bg-richblack-800 text-white shadow-sm shadow-richblack-200'
                                    />

                                </label>
                            )
                        }
                        <button type='submit' 
                        className=' h-11 w-full bg-yellow-100 rounded-lg text-black text-sm font-semibold'>
                            {
                                !emailSent ? "Reset Password" : "Resend Email"
                            }
                        </button>

                    </form>
                    <div >
                        <Link to='/login'
                        className=' flex flex-row items-center gap-2 text-sm' >
                            <FaArrowLeftLong/>
                            <p>Back to Login</p>
                                
                        </Link>
                    </div>
                    
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword