import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "default" | "lg" | "xl" | "icon";
  asChild?: boolean;
}

export default function Button({ 
  className = "", 
  variant = "primary",
  size = "default",
  asChild,
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-200 focus-brand disabled:pointer-events-none disabled:opacity-50 interactive-scale";
  
  const variantClasses = {
    primary: "bg-gradient-brand text-white shadow-soft hover:shadow-medium",
    secondary: "bg-white text-neutral-900 border-2 border-primary-200 hover:border-primary-300 shadow-soft",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
    ghost: "text-primary-600 hover:bg-primary-50",
    gradient: "bg-gradient-warm text-white shadow-soft hover:shadow-medium",
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
      {...props}
    >
      {children}
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