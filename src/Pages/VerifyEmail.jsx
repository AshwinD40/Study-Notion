import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { sendOtp, signUp } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';
import { PiClockCounterClockwiseFill } from "react-icons/pi";

const VerifyEmail = () => {
    const {signupData,loading} = useSelector( (state)=> state.auth);
    const [otp , setOtp] = useState('');
    const dispatch =useDispatch();
    const navigate = useNavigate();

    useEffect( () => {
      if (!signupData) {
          navigate("/signup");
        }
    })

    const handleOnSubmit = (e) =>{
      e.preventDefault();

      const {
        accountType, 
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      } = signupData;

      dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate))
    }

  return (
    <div className=' flex flex-col justify-center items-center text-white mt-40'>
        {
          loading 
          ? (
            <div>
              Loading...
            </div>
          ) : 
          (
            <div className=' flex flex-col gap-6 h-[500px] w-[350px]'>
              <h1 className=' text-3xl font-bold '>Verify email</h1>
              <p className='text-md text-richblack-300 mb-2'>A verification code has been sent to you. Enter the code below</p>

              <form onSubmit={handleOnSubmit}
              className='flex flex-col gap-2'>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}                 
                  renderInput={(props) => <input {...props} placeholder='-' 
                  className='text-[35px] m-2 bg-richblack-800 mx-3 text-white rounded-md px-1'/>}
                 
                />

                <button type='submit'
                className=' h-11 w-full bg-yellow-100 rounded-lg text-black text-sm font-semibold'>
                  Verify Email
                </button>
              </form>

              <div className=' flex flex-row justify-between items-center' >
                  <div>
                    <Link to='/login'
                      className=' flex flex-row items-center gap-2 text-sm' >
                        <FaArrowLeftLong/>
                        <p>Back to Login</p>                               
                    </Link>
                  </div>
                  <div className=' flex flex-row items-center gap-1 text-sm font-semibold text-blue-500'>
                       <PiClockCounterClockwiseFill
                       className='w-4 h-4 '/>
                       <button
                          onClick={() => dispatch(sendOtp(signupData.email, navigate))}>
                          Resend it
                      </button>
                  </div>
                  
              </div>
              
            </div>
          )
        }
    </div>
  )
}

export default VerifyEmail