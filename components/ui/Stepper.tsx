import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: "pending" | "current" | "complete";
}

interface StepperProps {
  steps: Step[];
  currentStep?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "simple" | "cards";
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = "horizontal",
  variant = "default",
  className,
}) => {
  const getCurrentStatus = (step: Step, index: number): "pending" | "current" | "complete" => {
    if (step.status) return step.status;
    
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex === -1) return "pending";
    
    if (index < currentIndex) return "complete";
    if (index === currentIndex) return "current";
    return "pending";
  };

  if (variant === "cards") {
    return (
      <div className={cn("grid gap-6", {
        "md:grid-cols-3": orientation === "horizontal" && steps.length <= 3,
        "md:grid-cols-4": orientation === "horizontal" && steps.length === 4,
        "space-y-6": orientation === "vertical",
      }, className)}>
        {steps.map((step, index) => {
          const status = getCurrentStatus(step, index);
          
          return (
            <div
              key={step.id}
              className={cn(
                "relative p-6 rounded-2xl border-2 transition-all duration-200",
                {
                  "border-neutral-200 bg-white": status === "pending",
                  "border-primary-300 bg-primary-50": status === "current", 
                  "border-secondary-300 bg-secondary-50": status === "complete",
                }
              )}
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                  {
                    "bg-neutral-100 text-neutral-600": status === "pending",
                    "bg-primary-500 text-white": status === "current",
                    "bg-secondary-500 text-white": status === "complete",
                  }
                )}>
                  {status === "complete" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.icon ? step.icon : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-display font-semibold",
                    {
                      "text-neutral-600": status === "pending",
                      "text-primary-900": status === "current",
                      "text-secondary-900": status === "complete",
                    }
                  )}>
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-neutral-600 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex",
      {
        "flex-col space-y-8": orientation === "vertical",
        "items-center space-x-8": orientation === "horizontal",
      },
      className
    )}>
      {steps.map((step, index) => {
        const status = getCurrentStatus(step, index);
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={cn("flex items-center", {
              "flex-col": orientation === "vertical",
              "flex-1": orientation === "horizontal",
            })}
          >
            <div className={cn("flex items-center", {
              "flex-col text-center": orientation === "vertical",
              "flex-row": orientation === "horizontal",
            })}>
              {/* Step Circle */}
              <div className={cn(
                "relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-200",
                {
                  "bg-neutral-100 text-neutral-600": status === "pending",
                  "bg-primary-500 text-white shadow-soft": status === "current",
                  "bg-secondary-500 text-white": status === "complete",
                }
              )}>
                {status === "complete" ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : step.icon ? step.icon : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className={cn("ml-4", {
                "ml-0 mt-3": orientation === "vertical",
              })}>
                <h3 className={cn(
                  "font-display font-semibold",
                  {
                    "text-neutral-600": status === "pending",
                    "text-primary-900": status === "current",
                    "text-secondary-900": status === "complete",
                  }
                )}>
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className={cn(
                "flex-1",
                {
                  "w-0.5 h-8 bg-neutral-200 mx-6": orientation === "vertical",
                  "h-0.5 bg-neutral-200 mx-4": orientation === "horizontal",
                }
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export { Stepper, type Step };