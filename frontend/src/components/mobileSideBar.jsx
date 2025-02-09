import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet"
import Sidebar from "./sidebar"
const MobileSideBar = () => {
  return (
  <Sheet>
    <SheetTrigger className="block md:hidden pr-4 hover:opacity-75 transition">
    <Menu/>
    </SheetTrigger>
    <SheetContent side='left'  className='p-0 bg-white'>
      <Sidebar/>
    </SheetContent>
  </Sheet>
  )
}

export default MobileSideBar