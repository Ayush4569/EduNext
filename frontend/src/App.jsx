
import { Routes,Route } from "react-router-dom";
import StudentSignup from "./pages/StudentSignup";
import StudentLogin from "./pages/StudentLogin";
import Layout from "./components/layout";
import ErrorPage from "./pages/Errorpage";
import Searchpage from "./pages/Searchpage";
import Teacherpage from "./pages/Teacherpage";
import Teacheranalytics from "./pages/Teacheranalytics";
import CreateCourses from "./pages/CreateCourses";
import axios from "axios";
import InstructorSignup from "./pages/InstructorSignup";
import InstructorLogin from "./pages/InstructorLogin";
import CourseUpdatePage from "./pages/CourseUpdatePage";
import ChapterUpdatePage from "./pages/ChapterUpdatePage";
import CoursePage from "./CoursePage";

function App() {
axios.defaults.withCredentials = true
  return (
   <Routes> 
     <Route path="*" element={<ErrorPage/>}/>
     <Route path="/" element={<Layout/>}>  
    <Route path="/search" element={<Searchpage/>} />  
    <Route path="/teacher/courses" element={<Teacherpage/>} />  
    <Route path="/teacher/analytics" element={<Teacheranalytics/>} />  
    <Route path="/teacher/courses/create" element={<CreateCourses/>} />  
    <Route path="/teacher/courses/:courseId" element={<CourseUpdatePage/>} /> 
    <Route path="/teacher/courses/:courseId/:chapterId/editChapter" element={<ChapterUpdatePage/>} /> 
    </Route>

     <Route path="/signup" element={<StudentSignup/>}/>
     <Route path="/login" element={<StudentLogin/>}/>
     <Route path="/teacher/signup" element={<InstructorSignup/>}/>
     <Route path="/teacher/login" element={<InstructorLogin/>}/>
     <Route path="/courses/:courseId" element={<CoursePage/>} />
    
   </Routes>

  );
}

export default App;
