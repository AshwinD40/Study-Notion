import { useState } from 'react'
import {sidebarLinks} from '../../../data/dashboard-links';
import SidebarLink from "./SidebarLink"
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { VscSignOut, VscMenu } from "react-icons/vsc";
import ConfirmationModal from '../../common/ConfirmationModal';

export default function Sidebar() {

    const {user, loading: profileLoading } = useSelector((state) => state.profile);

    const {loading:authLoading} = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // to keep track of confirmation modal
    const [confirmationModal , setConfirmationModal] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    if(profileLoading || authLoading){
        return(
            <div className=' grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800'>
                <div className='spinner'></div>
            </div>
        )
    }

  return (
    <>
        <div className=' flex min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>

            <div className=' flex flex-col'>
                {
                    sidebarLinks.map((link)=>{
                        if(link.type && user?.accountType !== link.type) 
                        return null
                        return(
                            <SidebarLink key={link.id} 
                            link={link} iconName={link.icon}
                            />
                        )
                    })}
            </div>

            <div className=' mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'/>

            <div className=' flex gap-2  flex-col'>
                <SidebarLink
                    link={{name: "Settings", path:"/dashboard/settings"}}
                    iconName="VscSettingsGear"
                />
                
                <button
                    onClick={() => 
                        setConfirmationModal({
                            text1: "Are You Sure?",
                            text2: "You Want to Logout",
                            btn1Text: "Logout",
                            btn2Text: "Cancel",
                            btn1Handler: () => dispatch(logout(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })
                    }
                    className=' text-sm font-medium text-richblack-300'
                >
                    <div className=' flex ml-8 items-center  gap-x-2'>
                        <VscSignOut
                        className=' text-lg'/>
                        <span>Logout</span>
                    </div>
                </button>
            </div>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

