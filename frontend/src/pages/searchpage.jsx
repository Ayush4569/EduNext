import { useState } from 'react';
import Categories from '../components/Categories'
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useSearchParams } from 'react-router-dom';
import SearchInput from '@/components/SearchInput';

const Searchpage = () => {
  const categories = ['Computer science','Music','Fitness','Photography','Accounting','Engineering','Filming']

  // const fetchCoursesByCategory = async (category) => {
  //   setSelectedCategory(category);
  //   setSearchParams({category})
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/courses/category?category=${category}`)
  //     if(response.statusText === "OK"){
  //       toast.success(response.data.message)
  //       setCourses(response.data.courses)
  //     }
  //   } catch (error) {
  //     console.log("Error fetching courses by category", error);
  //     toast.error(error?.response?.data?.message || error.message);
  //   }
  // };

  return (
    <>
    <div className='px-6 pt-6 md:hidden md:mb-0 block'>
      <SearchInput/>
    </div>
    <div className='p-6'>
     <Categories
      items={categories}
     />
    </div>
    </>
    
  )
}

export default Searchpage