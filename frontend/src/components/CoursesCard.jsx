import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"
const CoursesCard = ({course}) => {
  function formatPrice(price){
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'INR'}).format(price)
 }
  const courseProgress = (course.chapters.filter(chapter=> chapter.isCompleted).length) / course.chapters.length * 100
  return (
    <Link to={`/courses/${course._id}`} className="hover:cursor-pointer" >
      <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-4 h-full">
      <div className="w-full aspect-video relative rounded-md overflow-hidden">
       <img src={course.coverImage} alt={course.title} className="object-cover" />
      </div>
      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          {course.title}
        </div>
        <p className="text-xs text-muted-foreground">
          {course.category}
        </p>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs ">
        <div className="flex items-center gap-x-2 text-slate-500">
                <BookOpen className="h-5 w-5 object-cover" />
          <span>
            {course.chapters.length} {course.chapters.length > 1 ? 'Chapters' : 'Chapter'}
          </span>
        </div>
        </div>
        {
          course.isEnrolled ? <p className="text-green-500/45 text-pretty">
           {courseProgress} % completed
          </p>: <p>
         {
           formatPrice(course.price)
         }
          </p> 
        }

      </div>
      </div>
    </Link>
  
  )
}

export default CoursesCard