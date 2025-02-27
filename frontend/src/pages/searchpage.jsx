import { useState,useEffect } from 'react';
import Categories from '../components/Categories'
import axios from "axios";
import toast from "react-hot-toast";
import {useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/SearchInput';
import CoursesCard from '@/components/CoursesCard';

const Searchpage = () => {
  const categories = ['Computer science','Music','Fitness','Photography','Accounting','Engineering','Filming']
  const [courses, setCourses] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || null;
  const title = searchParams.get("title") || null;
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/courses`,{
          params:{category,title},
          withCredentials:true
        })
        if(response.statusText === "OK" && response.data.courses){
          setCourses(response.data.courses)
        }
      } catch (error) {
        console.log("Error fetching courses", error);
        toast.error(error?.response?.data?.message || error.message);
      }
    };
    fetchCourses();
  }, [title,category])

  return (
    <>
    <div className='px-6 pt-6 md:hidden md:mb-0 block'>
      <SearchInput/>
    </div>
    <div className='p-6 space-y-4'>
     <Categories
      items={categories}
     />
     <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 w-full'>
     {
      courses?.map((course)=>{
        return  <CoursesCard key={course._id} course={course} />
      })
     }
     </div>
    </div>
    </>
    
  )
}

export default Searchpage