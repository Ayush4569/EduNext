import { Navigate, Outlet } from "react-router-dom";
import { useStudent } from "../context/StudentContext";
import { useInstructor } from "../context/InstructorContext";
import { Loader2 } from "lucide-react";

const AuthGuard = ()=>{
    const { student, loading } = useStudent();
    const { instructor, loading: instructorLoading } = useInstructor();
    if (loading || instructorLoading) {
        return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-cyan-700" size={100} />
        </div>
        );
    }
    if (!student && !instructor) {
        return <Navigate to="/signup" />;
    }
    return <Outlet />;
}
export default AuthGuard