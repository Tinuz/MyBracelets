import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "default" | "lg" | "xl" | "icon";
  asChild?: boolean;
  isLoading?: boolean;
}

export default function Button({ 
  className = "", 
  variant = "primary",
  size = "default",
  asChild,
  isLoading = false,
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-200 focus-brand disabled:pointer-events-none disabled:opacity-50 interactive-scale";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700",
    secondary: "bg-white text-primary-700 border-2 border-primary-400 hover:border-primary-500 hover:bg-primary-50 shadow-md",
    outline: "border-2 border-primary-500 text-primary-700 hover:bg-primary-50",
    ghost: "text-primary-600 hover:bg-primary-50",
    gradient: "bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-lg hover:shadow-xl",
  };
  
  const sizeClasses = {
    sm: "h-9 px-4 text-xs",
    default: "h-12 px-6 py-3",
    lg: "h-14 px-8 py-4 text-base",
    xl: "h-16 px-10 py-5 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button 
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />;
}

export function OutlineButton(props: ButtonProps) {
  return <Button variant="outline" {...props} />;
}

export function GradientButton(props: ButtonProps) {
  return <Button variant="gradient" {...props} />;
}

export function GhostButton(props: ButtonProps) {
  return <Button variant="ghost" {...props} />;
}