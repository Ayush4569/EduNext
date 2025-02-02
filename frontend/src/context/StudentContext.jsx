import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {ColorRing} from "react-loader-spinner"
const StudentContext = createContext({});

export const StudentContextProvider = ({children})=>{
   
    const [student,setStudent] = useState(null);
    const [loading,setLoading] = useState(true)

   useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASEURL}/api/v1students/profile`,{
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
        <ColorRing visible color="#4fa94d" width={200} height={200} />
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