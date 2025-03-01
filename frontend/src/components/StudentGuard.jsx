import { Navigate, Outlet } from "react-router-dom";
import { useStudent } from "../context/StudentContext";
const StudentGuard = () => {
    const { student } = useStudent();
  
    if (!student) {
      return <Navigate to="/signup" replace />;
    }
    return <Outlet />;
  };
  
  export default StudentGuard;