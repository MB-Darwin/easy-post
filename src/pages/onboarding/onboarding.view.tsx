"use client";

import React from "react";

import { baseComponentProps } from "../types/onboarding-steps-list";

export const OnboardingView = ({
    getCurrentStep,
    next,
    prev,
    isFirtsStep,
    isFinalStep,
    stepList,
}: baseComponentProps) => {
    if (getCurrentStep()?.component) {
        const Component = getCurrentStep()?.component.step;
        return (
            <div>
                {
                    Component && (
                        <Component 
                            next={next}
                            prev={prev}
                            isFirtsStep={isFirtsStep}
                            isFinalStep={isFinalStep}
                            stepList={stepList}
                            getCurrentStep={getCurrentStep}
                        />
                    )
                }
            </div>
        );
    }

    return null;
}