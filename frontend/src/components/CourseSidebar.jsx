import CourseSideBarRoutes from './CourseSideBarRoutes';
const CourseSidebar = ({course}) => {
  
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
              <h1 className="font-semibold">{course.title}</h1>
            </div>
            {/* Implement course progress tracker */}
            <div className="flex flex-col w-full">
              {course.chapters.map((chapter) => (
               <CourseSideBarRoutes key={chapter._id} course={course} chapter={chapter}  />
              ))}
            </div>
          </div>
  )
}

export default CourseSidebar