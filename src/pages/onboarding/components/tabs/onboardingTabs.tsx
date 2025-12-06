import { onboardingStepsListInterface } from "@/pages/types/onboarding-steps-list";

interface Props{
    tabs: onboardingStepsListInterface[];
    getCurrentStep: () => onboardingStepsListInterface | undefined;
}

export const OnboardingTabs = ({tabs, getCurrentStep}: Props) => {
    return (
        <div className="relative inline-block">
            <div className="flex items-center space-x-6">
                {tabs.map((tab) => (
                    <div key={tab.id} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${getCurrentStep()?.id === tab.id ? 
                                "bg-blue-600 text-white font-semibold shadow-lg" : 
                                "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}>
                            {tab.id}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${getCurrentStep()?.id === tab.id ? 
                                "text-blue-600 dark:text-blue-400" : 
                                "text-gray-600 dark:text-gray-300"
                            }`}>
                            {tab.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}