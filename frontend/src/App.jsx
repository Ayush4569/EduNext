
import { Routes,Route } from "react-router-dom";
import "./App.css";
import Signup from "../src/pages/signup";
import Login from "../src/pages/login";
import Layout from "./components/layout";
import ErrorPage from "./pages/errorpage";
import Searchpage from "./pages/searchpage";
import Teacherpage from "./pages/teacherpage";
import Teacheranalytics from "./pages/teacheranalytics";
import CreateCourses from "./pages/createCourses";

function App() {


  return (
  
   <Routes>
   
     <Route path="*" element={<ErrorPage/>}/>
     <Route path="/" element={<Layout/>}>  
    <Route path="/search" element={<Searchpage/>} />  
    <Route path="/teacher/courses" element={<Teacherpage/>} />  
    <Route path="/teacher/analytics" element={<Teacheranalytics/>} />  
    <Route path="/teacher/courses/create" element={<CreateCourses/>} />  
    </Route>
     <Route path="/signup" element={<Signup/>}/>
     <Route path="/login" element={<Login/>}/>
     
   </Routes>

  );
}

export default App;
