import { Routes, Route } from "react-router-dom";
import StudentSignup from "./pages/StudentSignup";
import StudentLogin from "./pages/StudentLogin";
import Layout from "./components/Layout";
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
import ChapterContent from "./pages/ChapterContent";
import CourseLayout from "./components/CourseLayout";
import StudentDashboard from "./pages/StudentDashboard";
import AuthGuard from "./components/AuthGuard";
import StudentGuard from "./components/StudentGuard";
import InstructorGuard from "./components/InstructorGuard";

function App() {
  axios.defaults.withCredentials = true;
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Layout />}>
          <Route element={<StudentGuard />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/search" element={<Searchpage />} />
          </Route>
          <Route element={<InstructorGuard />}>
            <Route path="/teacher/courses" element={<Teacherpage />} />
            <Route path="/teacher/analytics" element={<Teacheranalytics />} />
            <Route path="/teacher/courses/create" element={<CreateCourses />} />
            <Route
              path="/teacher/courses/:courseId"
              element={<CourseUpdatePage />}
            />
            <Route
              path="/teacher/courses/:courseId/:chapterId/editChapter"
              element={<ChapterUpdatePage />}
            />
          </Route>
        </Route>
        <Route element={<StudentGuard />}>
          <Route path="/courses/:courseId" element={<CourseLayout />}>
            <Route
              path="/courses/:courseId/chapters/:chapterId"
              element={<ChapterContent />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="/signup" element={<StudentSignup />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/teacher/signup" element={<InstructorSignup />} />
      <Route path="/teacher/login" element={<InstructorLogin />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
