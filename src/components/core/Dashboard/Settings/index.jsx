import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import DeleteProfile from './DeleteProfile';
import EditProfile from './EditProfile';
import UpdatePassword from './UpdatePassword';

export default function Settings(){
  return (
    <>
        <h1 className=' mb-14 text-3xl font-medium text-richblack-5'>
            Edit Profile
        </h1>

        {/* Change Profile Picture */}
        <ChangeProfilePicture/>
        {/* Profile */}
        <EditProfile/>
        {/* Password */}
        <UpdatePassword/>
        {/* Delete Account */}
        <DeleteProfile/>
    </>
  )
}
