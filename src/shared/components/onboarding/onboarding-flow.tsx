"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChannelsStep,
  ProjectStep,
  SettingsStep,
  WelcomeStep,
  WorkspaceStep,
} from "@/shared/forms";

export type UserType = "merchant" | "agency" | null;

export interface OnboardingData {
  userType: UserType;
  workspaceName?: string;
  invitedMembers?: Array<{ email: string; role: "moderator" | "member" }>;
  projectName?: string;
  projectGoals?: string;
  projectDescription?: string;
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  connectedChannels?: {
    facebook?: boolean;
    instagram?: boolean;
    whatsapp?: boolean;
    messenger?: boolean;
  };
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ userType: null });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const getTotalSteps = () => {
    return data.userType === "agency" ? 5 : 4;
  };

  const renderStep = () => {
    // Step 1: Welcome and user type selection
    if (currentStep === 1) {
      return (
        <WelcomeStep
          onNext={(userType) => {
            updateData({ userType });
            nextStep();
          }}
        />
      );
    }

    // Step 2: Agency - Workspace setup, Merchant - Project creation
    if (currentStep === 2) {
      if (data.userType === "agency") {
        return (
          <WorkspaceStep
            onNext={(workspaceData) => {
              updateData(workspaceData);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      } else {
        return (
          <ProjectStep
            userType="merchant"
            onNext={(projectData) => {
              updateData(projectData);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      }
    }

    // Step 3: Agency - Project creation, Merchant - Settings
    if (currentStep === 3) {
      if (data.userType === "agency") {
        return (
          <ProjectStep
            userType="agency"
            onNext={(projectData) => {
              updateData(projectData);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      } else {
        return (
          <SettingsStep
            onNext={(settingsData) => {
              updateData(settingsData);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      }
    }

    // Step 4: Agency - Settings, Merchant - Channels
    if (currentStep === 4) {
      if (data.userType === "agency") {
        return (
          <SettingsStep
            onNext={(settingsData) => {
              updateData(settingsData);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      } else {
        return (
          <ChannelsStep
            onNext={(channelsData) => {
              updateData(channelsData);
              console.log("Onboarding complete!", { ...data, ...channelsData });
            }}
            onBack={prevStep}
          />
        );
      }
    }

    // Step 5: Agency - Channels
    if (currentStep === 5 && data.userType === "agency") {
      return (
        <ChannelsStep
          onNext={(channelsData) => {
            updateData(channelsData);
            console.log("Onboarding complete!", { ...data, ...channelsData });
          }}
          onBack={prevStep}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen onboarding-gradient flex flex-col">
      {currentStep > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1 px-6 py-4">
            {Array.from({ length: getTotalSteps() }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                  index + 1 <= currentStep ? "bg-foreground" : "bg-border"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="w-full max-w-md"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
