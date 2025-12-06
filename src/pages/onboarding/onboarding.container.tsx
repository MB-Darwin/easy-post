"use client";

import { useState } from "react";
import { OnboardingView } from "./onboarding.view";
import { WelcomeStep } from "./components/steps/welcome/welcome-steps";
import { onboardingStepsListInterface } from "../types/onboarding-steps-list";
import { CategorieStep } from "./components/steps/categorie/categorie-steps";
import { ProfileCompanieStep } from "./components/steps/profile-companie/profile-companie-steps";
import { WorkspaceStep } from "./components/steps/worskpace/workspace-steps";

export const OnboardingContainer = () => {

    const [currentStep, setCurrentStep] = useState<number>(1);
    const stepList: onboardingStepsListInterface[] = [
        {id: 1, label: "Bienvenue", component: {
            step: WelcomeStep
        }},
        {id: 2, label: "Categorie", component: {
            step: CategorieStep
        }},
        {id: 3, label: "profile_company", component: {
            step: ProfileCompanieStep
        }},
        {id: 4, label: "workspace", component: {
            step: WorkspaceStep 
        }},
    ];

    const getCurrentStep = () => {
        return stepList.find(step => step.id === currentStep);
    }

    const next = () => {
        if(currentStep < stepList.length) {
            setCurrentStep(currentStep + 1);
        }
    }

    const prev = () => {
        if(currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    const isFirtsStep = () => {
        if (currentStep === 1) {
            return true;
        }
        return false;
    }

    const isFinalStep = () => {
        if (currentStep === stepList.length) {
            return true;
        }
        return false;
    }
    
    return (
        <OnboardingView 
        getCurrentStep={getCurrentStep}
        next={next}
        prev={prev}
        isFirtsStep={isFirtsStep}
        isFinalStep={isFinalStep}
        stepList={stepList}
        />
    );
}