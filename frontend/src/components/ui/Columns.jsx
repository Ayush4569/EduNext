import { ArrowUpDown, MoreHorizontal, PencilIcon } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const columns = [
  {
    accessorKey: "title",
    header: ({column})=>{
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "price",
    header: ({column})=>{
    return(
      <Button
      variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    )
    },
    cell:({row})=>{
    const price = row.original.price || 0
    return (
   new Intl.NumberFormat("en-US", {style:"currency", currency:"INR"}).format(price))
    }
  },
  {
    accessorKey: "isPublished",
    header: ({column})=>{
      return(
        <Button
        variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
      },
      cell:({row})=>{
        const {isPublished} = row.original
        return(
          <Badge  className={cn(
            "bg-slate-500 ",
            isPublished && "bg-sky-700"
          )}>
            {isPublished ? 'Published' : 'Unpublished'}
          </Badge>
        )
      }
  },
  {
    id:"actions",
    cell:({row})=>{
      const {_id} = row.original
      return(
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
         <Link to={`/teacher/courses/${_id}`}>
          <DropdownMenuItem>
            <PencilIcon className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
         </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      
      )
    }
  },
];
