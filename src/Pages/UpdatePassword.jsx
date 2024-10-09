import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UpdatePassword = () => {
    const [formData , setFormData] = useState(
        {
            password:"",
            confirmPassword:"",
        }
    )
    const dispatch = useDispatch();
    const location = useLocation()
    const {loading} = useSelector( (state) => state.auth);
    const [showPassword , setShowPassword] = useState(false)
    const [showConfirmPassword , setShowConfirmPassword] = useState(false)

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) =>{
        setFormData((prevData) =>(
            {
                ...prevData ,
                [e.target.name] : e.target.value,
            }
        )) 
    }

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token ))
    }

  return (
    <div className=' flex flex-col justify-center items-center text-white mt-32'>
        {
            loading ? 
            (
                <div>
                    Loading. . .
                </div>
            ) : (
                
                <div className=' flex flex-col gap-2 h-[500px] w-[360px]'>
                    <h1 className=' text-3xl font-bold '>Choose new password</h1>
                    <p className='text-md text-richblack-300 mb-2'>
                    Almost done. Enter your new password and youre all set.</p>

                    <form onSubmit={handleOnSubmit}
                    className='flex flex-col gap-2'>

                        <label className='flex flex-col  '>
                            <p className=' text-[13px] font-semibold text-richblack-100'>New Password<span className='text-pink-300 pl-1 text-sm'>*</span></p>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                placeholder='Password'
                                onChange={handleOnChange}
                                className=' relative w-full h-11 rounded-md px-3 bg-richblack-800 text-white shadow-sm shadow-richblack-200'
                                
                            />
                            <span
                            onClick={()=> setShowPassword((prev) =>!prev)}
                            className="absolute right-[600px] top-[325px] cursor-pointer"
                            >
                                {
                                    showPassword 
                                    ? <FaEyeSlash fontSize={24}/> 
                                    : <FaEye fontSize={24}/>
                                }
                            </span>
                            
                        
                        </label>

                        <label className='flex flex-col gap-1 mb-6'>
                            <p className=' text-[13px] font-semibold text-richblack-100'>Confirm new Password<span className='text-pink-300 pl-1 text-sm'>*</span></p>
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                placeholder='Confirm Password'
                                onChange={handleOnChange}
                                className=' relative w-full h-11 rounded-md px-3 bg-richblack-800 text-white shadow-sm shadow-richblack-200'
                            />
                            <span
                            onClick={()=> setShowConfirmPassword((prev) =>!prev)}
                            className="absolute right-[600px] top-[400px] cursor-pointer"
                            >
                                {
                                    showConfirmPassword 
                                    ? <FaEyeSlash fontSize={24}/> 
                                    : <FaEye fontSize={24}/>
                                }
                            </span>
                        
                        </label>

                        <button type='submit'
                        className=' h-11 w-full bg-yellow-100 rounded-lg text-black text-sm font-semibold'>
                                Reset Password
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

export default UpdatePassword