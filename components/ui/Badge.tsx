import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "default" | "lg";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-full font-medium transition-colors";
    
    const variantClasses = {
      default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
      primary: "bg-primary-100 text-primary-800 border border-primary-200",
      secondary: "bg-secondary-100 text-secondary-800 border border-secondary-200",
      success: "bg-green-100 text-green-800 border border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      error: "bg-red-100 text-red-800 border border-red-200",
      outline: "border-2 border-primary-200 text-primary-700 bg-transparent",
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs h-5",
      default: "px-3 py-1 text-sm h-6",
      lg: "px-4 py-1.5 text-base h-8",
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };