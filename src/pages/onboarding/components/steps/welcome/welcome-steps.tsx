"use client";

import React from "react";
import { baseComponentProps } from "../types/onboarding-steps-list";
import { OnboardingTabs } from "../../tabs/onboardingTabs";

export const WelcomeStep = (props: baseComponentProps) => {
    const { next, isFinalStep } = props;
    
    return (
        <div className="text-center py-6 md:py-10">
            {/* Icône ou illustration */}
            <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center">
                    <span className="text-4xl">👋</span>
                </div>
            </div>
            
            {/* Titre */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Bienvenue sur EasyPost !
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                Nous sommes ravis de vous accueillir. En quelques étapes simples, 
                nous allons configurer votre compte pour une expérience optimale.
            </p>
            
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-8 text-left max-w-2xl mx-auto">
                <h2 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Ce que vous allez faire :
                </h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Choisir vos catégories d'intérêt
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Configurer vos préférences
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Découvrir les fonctionnalités principales
                    </li>
                </ul>
            </div>
            
            {/* Bouton Suivant */}
            <button 
                onClick={next}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                         text-white font-semibold rounded-full shadow-lg hover:shadow-xl 
                         transition-all duration-300 transform hover:-translate-y-1"
            >
                {isFinalStep ? "Terminer" : "Commencer l'onboarding →"}
            </button>
            
            {/* Note optionnelle */}
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Ce processus prendra environ 2 minutes
            </p>

            <div className="mt-6">
                <OnboardingTabs
                    tabs={props.stepList}
                    getCurrentStep={props.getCurrentStep}
                />
            </div> 
        </div>
    );
}