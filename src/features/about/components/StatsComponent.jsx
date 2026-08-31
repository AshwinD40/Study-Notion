import React from 'react'

const StatsComponent = () => {

    const Stats = [
        {count: "5K" , lable: "Active Students"},
        {count: "10+" , lable: "Mentors"},
        {count: "200+" , lable: "Courses"},
        {count: "50+" , lable: "Awards"},
    ];


  return (
    <section className='w-full bg-richblack-800'>
        <div className='w-11/12 mx-auto max-w-maxContent p-14 '>
            <div className='flex lg:flex-row md:flex-row sm:flex-row  flex-col justify-between lg:px-10 gap-4'>
                {
                    Stats.map((data, index) => {
                        return (
                            <div key={index} className=' text-center justify-center flex flex-col gap-2'>
                                <h1 className=' text-3xl font-bold'>{data.count}</h1>
                                <h2 className=' text-richblack-600 font-bold'>{data.lable}</h2>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default StatsComponent