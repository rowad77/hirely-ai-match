
import * as React from "react"
import { cn } from "@/lib/utils"

interface SimpleBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

function SimpleBadge({ 
  className, 
  variant = "default",
  size = "md",
  ...props 
}: SimpleBadgeProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background text-foreground",
  }
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { SimpleBadge }
