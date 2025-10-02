"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PrimaryButton, SecondaryButton } from "./Button";
import { useTranslations } from 'next-intl';

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isValid?: boolean;
  isOptional?: boolean;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLoading?: boolean;
  showNavigation?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  completeButtonText?: string;
  className?: string;
}

const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStepId,
  onStepChange,
  onNext,
  onPrevious,
  onComplete,
  canGoNext = true,
  canGoPrevious = true,
  isLoading = false,
  showNavigation = true,
  nextButtonText,
  previousButtonText,
  completeButtonText,
  className,
}) => {
  const t = useTranslations('designer');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  // Mark steps as completed when we move past them
  useEffect(() => {
    setCompletedSteps(prevCompletedSteps => {
      const newCompletedSteps = new Set(prevCompletedSteps);
      steps.forEach((step, index) => {
        if (index < currentIndex) {
          newCompletedSteps.add(step.id);
        }
      });
      return newCompletedSteps;
    });
  }, [currentIndex, steps]);

  const getStepStatus = (step: WizardStep, index: number): "pending" | "current" | "complete" => {
    if (completedSteps.has(step.id)) return "complete";
    if (index === currentIndex) return "current";
    return "pending";
  };

  const getProgressPercentage = (): number => {
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const handleStepClick = (stepId: string, index: number) => {
    // Only allow navigation to completed steps or the next step
    if (completedSteps.has(stepId) || index <= currentIndex + 1) {
      onStepChange(stepId);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
          <div 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="text-right mt-2">
          <span className="text-sm text-gray-600">
            {t('step')} {currentIndex + 1} {t('of')} {steps.length}
          </span>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const isClickable = completedSteps.has(step.id) || index <= currentIndex + 1;

          return (
            <React.Fragment key={step.id}>
              
              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(step.id, index)}
                disabled={!isClickable}
                className={cn(
                  "relative flex flex-col items-center p-2 rounded-lg transition-all duration-200",
                  {
                    "cursor-pointer hover:bg-gray-50": isClickable,
                    "cursor-not-allowed opacity-50": !isClickable,
                  }
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200",
                  {
                    "bg-gray-100 text-gray-600": status === "pending",
                    "bg-primary-500 text-white shadow-lg scale-110": status === "current",
                    "bg-green-500 text-white": status === "complete",
                  }
                )}>
                  {status === "complete" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step Title */}
                <div className="mt-2 text-center">
                  <h3 className={cn(
                    "text-xs font-medium leading-tight",
                    {
                      "text-gray-600": status === "pending",
                      "text-primary-900 font-semibold": status === "current",
                      "text-green-700 font-semibold": status === "complete",
                    }
                  )}>
                    {step.title}
                  </h3>
                  {step.description && status === "current" && (
                    <p className="text-xs text-gray-500 mt-1 max-w-20">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Validation Indicator */}
                {status === "current" && step.isValid !== undefined && (
                  <div className={cn(
                    "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
                    {
                      "bg-green-500": step.isValid,
                      "bg-red-500": !step.isValid && !step.isOptional,
                      "bg-yellow-500": !step.isValid && step.isOptional,
                    }
                  )}>
                    {step.isValid ? (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-1 h-1 bg-white rounded-full" />
                    )}
                  </div>
                )}
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors duration-200",
                  {
                    "bg-gray-200": index >= currentIndex,
                    "bg-primary-500": index < currentIndex,
                  }
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {showNavigation && (
        <div className="flex justify-between items-center pt-4">
          <div>
            {!isFirstStep && (
              <SecondaryButton
                onClick={onPrevious}
                disabled={!canGoPrevious || isLoading}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{previousButtonText || t('previous')}</span>
              </SecondaryButton>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Step validation feedback */}
            {steps[currentIndex]?.isValid === false && !steps[currentIndex]?.isOptional && (
              <span className="text-sm text-red-600 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{t('pleaseComplete')}</span>
              </span>
            )}

            {isLastStep ? (
              <PrimaryButton
                onClick={onComplete}
                disabled={!canGoNext || isLoading}
                isLoading={isLoading}
                className="flex items-center space-x-2"
              >
                <span>{completeButtonText || t('complete')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onClick={onNext}
                disabled={!canGoNext || isLoading}
                isLoading={isLoading}
                className="flex items-center space-x-2"
              >
                <span>{nextButtonText || t('next')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { WizardStepper, type WizardStep };