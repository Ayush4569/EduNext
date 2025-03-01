import CourseSideBarRoutes from "./CourseSideBarRoutes";
const CourseSidebar = ({course,courseProgress}) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col gap-y-2 border-b">
        <h1 className="font-semibold">{course?.title}</h1>
        {course?.isEnrolled && (
          <>
            <div className="w-full">
              
              <div className="w-full bg-gray-200 rounded-sm h-4 overflow-hidden shadow-md">
                <div
                  className={`h-full bar transition-all duration-1000 ease-out`}
                  style={{
                    width: `${courseProgress?.progressPercentage}%`,
                  }}
                >
                  <span className="sr-only">{courseProgress?.progressPercentage}% Complete</span>
                </div>
              </div>
            </div>
            <p className="text-base text-green-600/80">
            {courseProgress?.progressPercentage}% complete
            </p>
          </>
        )}
    
      </div>
    
      <div className="flex flex-col w-full">
        {course?.chapters?.map((chapter) => (
          chapter.isPublished && (
            <CourseSideBarRoutes
            key={chapter?._id}
            course={course}
            chapter={chapter}
          />
          )
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
