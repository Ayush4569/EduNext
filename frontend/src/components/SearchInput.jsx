import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/UseDebounce";
import { useEffect, useState } from "react";
import qs from "query-string";
const SearchInput = () => {
    const [value,setValue] = useState("");
    const navigate = useNavigate()
    const debouncedValue = useDebounce(value,500)
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const queryCategory = searchParams.get("category");
    useEffect(() => {
      let url = qs.stringifyUrl({
        url: pathname,
        query: {
          category: queryCategory,
          title: debouncedValue
        }
      },{skipNull:true,skipEmptyString:true}
    )
    navigate(url)
    }, [queryCategory,debouncedValue,navigate,pathname])
    
  return (
    <div className="relative">
    <Search className="h-5 w-5 absolute top-[10px] left-3 text-slate-600" />
    <Input
    value={value}
    onChange={(e) => setValue(e.target.value)}
      className="w-full md:w-[300px] pl-9 bg-slate-100 focus-visible:ring-slate-200 rounded-md"
      placeholder="Search for courses"
    />
  </div>
  )
}

export default SearchInput