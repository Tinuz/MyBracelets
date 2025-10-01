import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "soft" | "gradient" | "dark";
  spacing?: "sm" | "default" | "lg" | "xl";
  container?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", spacing = "default", container = true, children, ...props }, ref) => {
    const baseClasses = "w-full";
    
    const variantClasses = {
      default: "bg-white",
      soft: "bg-soft",
      gradient: "bg-gradient-warm",
      dark: "bg-neutral-900 text-white",
    };

    const spacingClasses = {
      sm: "py-12",
      default: "py-16 md:py-20",
      lg: "py-20 md:py-24",
      xl: "py-24 md:py-32",
    };

    const containerClasses = container ? "container mx-auto px-4 sm:px-6 lg:px-8" : "";

    return (
      <section
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], spacingClasses[spacing], className)}
        {...props}
      >
        {container ? (
          <div className={containerClasses}>
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = "Section";

const SectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-center mb-12 md:mb-16", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4",
        className
      )}
      {...props}
    />
  )
);
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-lg md:text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto",
        className
      )}
      {...props}
    />
  )
);
SectionDescription.displayName = "SectionDescription";

export { Section, SectionHeader, SectionTitle, SectionDescription };