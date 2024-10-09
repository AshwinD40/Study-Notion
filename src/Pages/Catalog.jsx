import React, { useEffect, useState } from 'react'
import Footer from "../components/common/Footer"
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import {getCatalogPageData} from "../services/operations/PageAndComponentData"
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';

const Catalog = () => { 

    const {catalogName} = useParams();
    const [catalogPageData , setCatalogPageData] = useState(null);
    const [categoryId , setCategoryId] = useState("");

    // fetch all categories
    useEffect( () => {
        const getCategories = async () => {
            const res = await apiConnector("GET" , categories.CATEGORIES_API );
            const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;

            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName])

    useEffect( () => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogPageData(categoryId);
                console.log("Printing res:" , res)
                setCatalogPageData(res);
            }
            catch(error){
                console.log(error)
            }

        }
        if(categoryId){
            getCategoryDetails();
        }
        
    },[categoryId])

  return (
    <div className=' text-richblack-5 w-full mx-auto'>
      <div className='bg-richblack-800 px-28 py-10  space-y-3'>
        <p className=' text-richblack-400 text-sm'>{`Home   /  Catalog  / `}
        <span className=' text-yellow-50'>
          {catalogPageData?.data?.selectedCategory?.name}
        </span>
        </p>
        <p className=' font-bold text-2xl'>{catalogPageData?.data?.selectedCategory?.name}</p>
        <p className=' text-sm text-richblack-400'>{catalogPageData?.data?.selectedCategory?.description}</p>

      </div>
        <div className=' mb-28 mt-8 px-28'>
            {/*section 01*/}
            <div className=' flex flex-col space-y-5 '>
                <div className=' text-2xl font-bold'>Courses to get you started</div>
                <div className=' flex gap-x-4'>
                    <p>Most Populer</p>
                    <p>New</p>
                    
                </div>
                <div className='w-full h-[1px] bg-richblack-400'></div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
                </div>
            </div>

            {/*section 02*/}
            <div className=' flex flex-col '>
            <div className=' text-2xl font-bold py-10'>Top Courses in {catalogPageData?.data?.selectedCategory?.name} </div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
            </div>


            {/*section 01*/}
            <div className=' my-20'>
                <div className=' text-2xl font-bold'>Frequently Bougth Together</div>
                <div>
                    <div className=' grid grid-cols-1 lg:grid-cols-2'>
                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course, index) => {
                                <Course_Card course={course} key={index} Heigth={"h-[400px]"}/>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>

      <Footer/>
    </div>
  )
}

export default Catalog