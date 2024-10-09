import React, { useEffect, useState } from 'react'

const RequirementField = ({name, label, register,errors, setValue , getValues}) => {

    const [requirement , setRequirement] = useState("");
    const [requirementList , setRequirementList] = useState([]);

    useEffect(()=>{
        register(name, {
            required: true,
            // validate:(value) => value.length > 0
        })
    },[])

    useEffect(()=> {
        setValue(name ,requirementList)
    },[requirementList])

    const handleAddRequirement = () =>{
        if(requirement){
            setRequirementList([...requirementList, requirement]);
        }
    }
    const handleRemoveRequirement = (index) =>{
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    }

  return (
    <div>
        <label htmlFor={name} className=' text-[12px] text-richblack-50'>{label}<sup className='text-pink-500 '>*</sup></label>
        <div>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className=' bg-richblack-700 rounded-md shadow-sm shadow-richblack-300 py-2 px-3 w-full'
            />
            <button
                type='button'
                onClick={handleAddRequirement}
                className='text-yellow-5 font-semibold'
            >
                Add
            </button>
        </div>

        { requirementList.length > 0 && (
                <ul>
                    { requirementList.map((requirement , index) =>(
                            <li key={index} className=' flex gap-2 items-center text-richblack-5'>
                                <span>{requirement}</span>
                                <button 
                                    type='button'
                                    onClick={() => handleRemoveRequirement(index)}
                                    className=' text-pure-greys-700 font-semibold'
                                >clear</button>
                            </li>
                        ))
                    }
                </ul>
            )       
        }
        { errors[name] && (
                <span>
                    {label} is required
                </span>
            )
        }
    </div>
  )
}

export default RequirementField