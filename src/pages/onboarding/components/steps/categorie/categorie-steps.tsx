"use client";

import React, { useState } from "react";
import { baseComponentProps } from "../../types/onboarding-steps-list";
import { OnboardingTabs } from "../../tabs/onboardingTabs";


export const CategorieStep = (props: baseComponentProps) => {
    const { next, prev, isFirstStep, isFinalStep, currentStepId } = props;
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
    // Catégories plus détaillées pour une entreprise de livraison
    const categories = [
        {
            id: "express",
            name: "Livraison Express",
            icon: "🚚",
            description: "Livraisons rapides et urgentes"
        },
        {
            id: "standard",
            name: "Livraison Standard", 
            icon: "📦",
            description: "Livraisons régulières"
        },
        {
            id: "international",
            name: "International",
            icon: "🌍",
            description: "Expéditions à l'international"
        },
        {
            id: "tracking",
            name: "Suivi en Temps Réel",
            icon: "📍",
            description: "Suivi précis des colis"
        },
        {
            id: "billing",
            name: "Facturation & Tarifs",
            icon: "💰",
            description: "Gestion des factures et tarifs"
        },
        {
            id: "api",
            name: "API & Intégration",
            icon: "⚙️",
            description: "Connectivité avec vos systèmes"
        },
        {
            id: "analytics",
            name: "Analytics & Rapports",
            icon: "📊",
            description: "Données et insights"
        },
        {
            id: "support",
            name: "Support Premium",
            icon: "🎯",
            description: "Assistance dédiée"
        },
        {
            id: "eco",
            name: "Livraison Écologique",
            icon: "🌱",
            description: "Options vertes"
        }
    ];
    
    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };
    
    const getSelectedCategoriesNames = () => {
        return categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(cat => cat.name);
    };
    
    return (
        <div className="py-6 md:py-8 px-4 md:px-8 lg:px-16 ">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <span className="text-xl">📋</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Vos besoins
                    </h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                    Sélectionnez les services qui correspondent à vos besoins professionnels.
                    Cela nous aide à personnaliser votre expérience EasyPost.
                </p>
            </div>
            
            {/* Grille de catégories améliorée */}
            <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-4 mb-8">
                {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    
                    return (
                        <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`
                                p-5 rounded-xl border-2 text-left transition-all duration-300
                                ${isSelected
                                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                                }
                                hover:scale-[1.02] active:scale-[0.98]
                            `}
                        >
                            <div className="flex items-start">
                                <div className={`
                                    w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-2xl
                                    ${isSelected
                                        ? 'bg-blue-100 dark:bg-blue-900/40'
                                        : 'bg-gray-100 dark:bg-gray-800'
                                    }
                                `}>
                                    {category.icon}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-semibold ${
                                            isSelected 
                                                ? 'text-blue-700 dark:text-blue-300' 
                                                : 'text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {category.name}
                                        </h3>
                                        
                                        <div className={`
                                            w-5 h-5 rounded border flex items-center justify-center
                                            ${isSelected
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                            }
                                        `}>
                                            {isSelected && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {/* Résumé des sélections */}
            {selectedCategories.length > 0 && (
                <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✅</span>
                        <span className="text-green-800 dark:text-green-300 font-medium">
                            {selectedCategories.length} service(s) sélectionné(s)
                        </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {getSelectedCategoriesNames().map((name, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Instructions */}
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    💡 <strong>Conseil :</strong> Sélectionnez au moins 2 catégories pour une expérience optimale.
                    Vous pourrez toujours modifier ces préférences plus tard.
                </p>
            </div>
            
            {/* Boutons de navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
                <div className="flex-1">
                    <button
                        onClick={prev}
                        disabled={isFirstStep}
                        className={`
                            px-6 py-3 rounded-full font-medium transition-all flex items-center
                            ${isFirstStep
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }
                        `}
                    >
                        <span className="mr-2">←</span>
                        Retour
                    </button>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Étape {currentStepId} sur 3
                    </div>
                    
                    <button
                        onClick={next}
                        disabled={selectedCategories.length === 0}
                        className={`
                            px-8 py-3 rounded-full font-semibold transition-all flex items-center
                            ${selectedCategories.length === 0
                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            }
                        `}
                    >
                        Continuer vers le profil entreprise
                        <span className="ml-2">→</span>
                    </button>
                </div>
                
                <div className="flex-1 text-right">
                    <button
                        onClick={next}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Passer cette étape
                    </button>
                </div>
            </div>

                        <div className="mt-6">
                            <OnboardingTabs
                                tabs={props.stepList}
                                getCurrentStep={props.getCurrentStep}
                            />
                        </div> 
        </div>
    );
}