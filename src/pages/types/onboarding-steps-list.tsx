export interface baseComponentProps {
    next : () => void;
    prev : () => void;
    isFirtsStep : () => boolean;
    isFinalStep : () => boolean;
    stepList : onboardingStepsListInterface[]; 
    getCurrentStep : () => onboardingStepsListInterface | undefined;
};

export interface onboardingStepsListInterface {
    id: number;
    label: string;
    component: {
        step: React.ComponentType<baseComponentProps>;
    }
}