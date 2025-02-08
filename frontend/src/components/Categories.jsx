import {
  FcEngineering,
  FcMusic,
  FcOldTimeCamera,
  FcFilmReel,
  FcBusinessman,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./CategoryItem";
const Categories = ({items}) => {
  const iconMap = {
    "Computer science": <FcEngineering className="h-6 w-6" />,
    Music: <FcMusic className="h-6 w-6" />,
    Fitness: <FcSportsMode className="h-6 w-6" />,
    Photography: <FcOldTimeCamera className="h-6 w-6" />,
    Accounting: <FcBusinessman className="h-6 w-6" />,
    Engineering: <FcSalesPerformance className="h-6 w-6" />,
    Filming: <FcFilmReel className="h-6 w-6" />,
  };
   
  return (
    <>
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
     {
      items.map((category) => (
        <CategoryItem
          key={category}
          category={category}
          icon={iconMap[category]}
        />
      ))
     }
    </div>
    </>
    
  );
};

export default Categories;
