<Routes>
<Route element={<AuthGuard />}>
  <Route path="/" element={<Layout />}>
    <Route element={<StudentGuard />}>
      <Route index element={<StudentDashboard />} />
      <Route path="/search" element={<SearchPage />} />
    </Route>

    <Route element={<InstructorGuard />}>
      <Route path="/teacher/courses" element={<TeacherPage />} />
      <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
      <Route path="/teacher/courses/create" element={<CreateCourses />} />
    </Route>
  </Route>
</Route>

{/* Public Routes (Login & Signup) */}
<Route path="/signup" element={<StudentSignup />} />
<Route path="/login" element={<StudentLogin />} />
<Route path="/teacher/signup" element={<InstructorSignup />} />
<Route path="/teacher/login" element={<InstructorLogin />} />

{/* Error Page for Undefined Routes */}
<Route path="*" element={<ErrorPage />} />
</Routes>