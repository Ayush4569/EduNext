import axios from "axios";
import { Loader2 } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
const StudentContext = createContext({});

export const StudentContextProvider = ({children})=>{
   
    const [student,setStudent] = useState(null);
    const [loading,setLoading] = useState(true)

   useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASEURL}/api/v1/students/profile`,{
        withCredentials:true
    })
         .then((response)=>{
            setStudent(response.data)
         })
         .catch((error)=>{
            console.log('student context',error);
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
        <StudentContext.Provider value={{student,setStudent,loading}}>
            {children}
        </StudentContext.Provider>
    )
}
export const useStudent = ()=> useContext(StudentContext)