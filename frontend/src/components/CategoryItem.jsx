import { cn } from "@/lib/utils"
import qs from 'query-string'
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const CategoryItem = ({category,icon}) => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [searchParams,setSearchParams] = useSearchParams();
    const queryCategory = searchParams.get("category");
    const queryTitle = searchParams.get("title");
    const isSelected = queryCategory === category;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url:pathname,
            query:{
                category: isSelected ? null : category,
                title: queryTitle
            }
        },{skipNull:true,skipEmptyString:true})
       navigate(url)
    }

  return (
    <button
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-2 hover:border-sky-700 transition",
        isSelected && 'border-sky-700 bg-sky-200/20 text-sky-800 '
      )}
      type="button"
      onClick={onClick}
    >
      {icon && <span className="text-sky-700">{icon}</span>}
      <div className="truncate">{category}</div>
    </button>
  )
}

export default CategoryItem