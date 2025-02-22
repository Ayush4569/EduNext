import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Label } from "./ui/label";
const CoursesCard = ({ course }) => {
  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  }
  const courseProgress = course?.courseProgress?.progressPercentage || 0;
  return (
    <Link to={`/courses/${course._id}`} className="hover:cursor-pointer">
      <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-4 h-full">
        <div className="w-full aspect-video relative rounded-md overflow-hidden">
          <img
            src={course.coverImage}
            alt={course.title}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {course.title}
          </div>
          <p className="text-xs text-muted-foreground">{course.category}</p>
          <div className="mt-3 flex items-center gap-x-2 text-sm md:text-xs ">
            <div className="flex items-center gap-x-2 text-slate-500">
              <BookOpen className="h-5 w-5 object-cover" />
              <span>
                {course.chapters.length}{" "}
                {course.chapters.length > 1 ? "Chapters" : "Chapter"}
              </span>
            </div>
          </div>
          {course.isEnrolled ? (
            <div className="flex flex-col mt-2 gap-y-1 w-full">
              <Label htmlFor="progress" className="font-medium">
                Course Progress:
              </Label>
              <div className="w-full flex items-center gap-x-5">
                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-sm h-4 overflow-hidden shadow-md">
                    <div
                      className={`h-full bar transition-all duration-1000 ease-out`}
                      style={{
                        width: `${courseProgress}%`,
                      }}
                    >
                      <span className="sr-only">
                        {courseProgress}% Complete
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-medium text-justify">{courseProgress} %</p>
              </div>
            </div>
          ) : (
            <p className="mt-6">{formatPrice(course.price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CoursesCard;
