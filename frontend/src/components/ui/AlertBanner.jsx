import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertTriangle,CheckCircleIcon } from "lucide-react";
const AlertBanner = ({ label,variant = 'warning' }) => {
  const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center full gap-x-2",
    {
      variants:{
        variant:{
          warning: "bg-yellow-200/80 border-yellow-30 text-primary",
          success: "bg-emerald-700 border-emerald-800 text-secondary",
        }
      },
      defaultVariants:{
        variant: "warning"
      }
    }
  )
  return (
    <div className={cn(bannerVariants({ variant }))}>
      {variant === 'warning' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
     {label && label}
    </div>
  );
};

export default AlertBanner;
