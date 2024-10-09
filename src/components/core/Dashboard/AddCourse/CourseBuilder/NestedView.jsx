import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CgMenuBoxed } from "react-icons/cg";
import { MdEdit,MdDelete } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import SubSectionModal from "./SubSectionModal"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import { 
    deleteSection, 
    deleteSubSection 
} from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';

const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector((state)=> state.course);
    const {token} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();

    const [addSubSection , setAddSubSection] = useState(null);
    const [editSubSection , setEditSubSection] = useState(null);
    const [viewSubSection , setViewSubSection] = useState(null);

    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token,
        })
        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null);
    } 
    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({ subSectionId,  sectionId, token })
        if(result){
            const updatedCourseContent = course.courseContent.map((section) => 
            section._id === sectionId ? result : section);

            const updatedCourse = {...course ,courseContent : updatedCourseContent}
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null)
    }

  return (
    <div>

        <div 
            id='nestedViewContainer' 
            className=' mt-10 bg-richblack-700 p-8 rounded-lg'
        >
            {course?.courseContent?.map((section)=> (
                // section Dropdown
                <details key={section._id} open>
                    {/* Section Dropdown Content */}
                    <summary className=' flex items-center justify-between gap-x-3 py-2  border-b border-b-richblack-600'>
                        <div className=' flex flex-row gap-x-3 items-center'>
                            <CgMenuBoxed className="text-2xl text-richblack-50" />
                            <p className="font-semibold text-richblack-50">
                                {section.sectionName}
                            </p>
                        </div>
                        <div className=' flex items-center gap-x-3'>
                            <button
                                onClick={() =>
                                    handleChangeEditSectionName(
                                        section._id,
                                        section.sectionName
                                    )
                                }       
                            >
                                <MdEdit className="text-xl text-richblack-300" />
                            </button>
                            <button 
                                onClick={() => {
                                     setConfirmationModal({
                                        text1: "Delete This Section",
                                        text2: "All the lectures in this section will be deleted",
                                        btn1Text:"Delete",
                                        btn2Text:"Cancle",
                                        btn1Handler:() => handleDeleteSection(section._id),
                                        btn2Handler:() => setConfirmationModal(null)
                                     })}
                                } 
                            >
                                <MdDelete className='text-2xl text-pink-200' />
                            </button>

                            <span>|</span>
                            <FaCaretDown className=' text-xl text-richblack-300' />
                        </div>
                        

                    </summary>
                    
                    <div className='pb-5'>
                        {
                            section?.subSection?.map((data)=> (
                                <div 
                                    key={data?._id}
                                    onClick={()=> setViewSubSection(data)}
                                    className=' flex items-center py-2 pl-3 justify-between gap-x-3 border-b border-richblack-600'
                                >
                                    <div className=' flex flex-row gap-x-3 items-center'>
                                        <CgMenuBoxed className="text-2xl text-richblack-200"/>
                                        <p>{data.title}</p>
                                    </div>
                                    <div
                                        onClick={(e)=>e.stopPropagation()}
                                        className=' flex items-center gap-x-3'
                                    >
                                        <button
                                            onClick={() => setEditSubSection({...data, sectionId:section._id})}
                                        >
                                            <MdEdit className='text-xl text-richblack-200' />
                                        </button>
                                        <button
                                            onClick={()=>
                                                setConfirmationModal({
                                                    text1: "Delete This Sub Section",
                                                    text2: "Selected Video and Lecture will be deleted",
                                                    btn1Text:"Delete",
                                                    btn2Text:"Cancle",
                                                    btn1Handler:() => handleDeleteSubSection(data._id ,section._id),
                                                    btn2Handler:() => setConfirmationModal(null)
                                                })
                                            }
                                        >
                                            <MdDelete className='text-xl text-pink-200' />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                        <button 
                            onClick={()=> setAddSubSection(section._id)}
                            className=' flex pl-3  mt-4 items-center gap-x-2 text-yellow-100'
                        >
                            <FaPlus className=' text-md' />
                            <p>Add Lecture</p>
                        </button>
                    </div>

                </details>
            ))}
        </div>

        {   
            addSubSection ? (<SubSectionModal
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
                /> ) 
            : viewSubSection ? (<SubSectionModal
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}
                />) 
            : editSubSection ? (<SubSectionModal
                modalData={editSubSection}
                setModalData={setEditSubSection}
                edit={true}
                /> ) 
            : <div></div>  
        
        }
        {confirmationModal ? 
            (
                <ConfirmationModal modalData={confirmationModal} />
            ) :
             (
                <div></div>
             )
        }
    </div>

    
  )
}

export default NestedView