import axios from "axios";
import { Loader2 } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
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
        <Loader2 className="animate-spin text-cyan-700" size={100}/>
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