import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {ColorRing} from "react-loader-spinner"
const InstructorContext = createContext({});

export const InstructorContextProvider = ({children})=>{
   
    const [instructor,setInstructor] = useState(null);
    const [loading,setLoading] = useState(true)

   useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/instructors/profile`,{
        withCredentials:true
    })
         .then((response)=>{
            setInstructor(response.data)
         })
         .catch((error)=>{
            console.log('Instructor context',error);
         })
         .finally(()=> setLoading(false))
   }, [])
   if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ColorRing visible color="#4fa94d" width={200} height={200} />
         
      </div>
    );
  }
    return (
        <InstructorContext.Provider value={{instructor,setInstructor,loading}}>
            {children}
        </InstructorContext.Provider>
    )
}

export const useInstructor = ()=> useContext(InstructorContext)