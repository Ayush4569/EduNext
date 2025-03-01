import { Navigate, Outlet } from "react-router-dom";
import { useInstructor } from "../context/InstructorContext";

const InstructorGuard = () => {
  const { instructor } = useInstructor();

  if (!instructor) {
    return <Navigate to="/teacher/signup" replace />;
  }
  return <Outlet />;
};

export default InstructorGuard;
