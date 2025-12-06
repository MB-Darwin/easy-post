"use client";

import React, { useState, useEffect } from "react";
import { baseComponentProps } from "../types/onboarding-steps-list";
import { OnboardingTabs } from "../../tabs/onboardingTabs";


export const ProfileCompanieStep = (props: baseComponentProps) => {
    const { next, prev, isFirstStep, isFinalStep, currentStepId } = props;
    
    // États pour le formulaire
    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [industry, setIndustry] = useState("");
    const [siret, setSiret] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("FR");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [employeeCount, setEmployeeCount] = useState("");
    const [annualRevenue, setAnnualRevenue] = useState("");
    const [shippingVolume, setShippingVolume] = useState("");
    const [businessDescription, setBusinessDescription] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    
    // États pour les erreurs
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Options disponibles
    const companyTypeOptions = [
        "SARL",
        "SAS", 
        "SASU",
        "EURL",
        "SA",
        "SC",
        "EI",
        "Micro-entreprise",
        "Association",
        "Autre"
    ];
    
    const industryOptions = [
        "E-commerce & Retail",
        "Logistique & Transport",
        "Mode & Textile",
        "High-Tech & Électronique",
        "Alimentation & Boissons",
        "Santé & Beauté",
        "Édition & Média",
        "Services B2B",
        "Automobile",
        "Immobilier",
        "Tourisme",
        "Éducation",
        "Autre"
    ];
    
    const employeeOptions = [
        "1-5",
        "6-10", 
        "11-50",
        "51-100",
        "101-250",
        "251-500",
        "501-1000",
        "1000+"
    ];
    
    const revenueOptions = [
        "Moins de 50K€",
        "50K€ - 100K€",
        "100K€ - 500K€",
        "500K€ - 1M€",
        "1M€ - 5M€",
        "5M€ - 10M€",
        "10M€ - 50M€",
        "50M€+"
    ];
    
    const shippingVolumeOptions = [
        "Moins de 10/mois",
        "10-50/mois",
        "51-100/mois",
        "101-500/mois",
        "501-1000/mois",
        "1001-5000/mois",
        "5000+/mois"
    ];
    
    const countryOptions = [
        { code: "FR", name: "France", flag: "🇫🇷" },
        { code: "BE", name: "Belgique", flag: "🇧🇪" },
        { code: "CH", name: "Suisse", flag: "🇨🇭" },
        { code: "DE", name: "Allemagne", flag: "🇩🇪" },
        { code: "ES", name: "Espagne", flag: "🇪🇸" },
        { code: "IT", name: "Italie", flag: "🇮🇹" },
        { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
        { code: "US", name: "États-Unis", flag: "🇺🇸" },
        { code: "CA", name: "Canada", flag: "🇨🇦" },
        { code: "OTHER", name: "Autre", flag: "🌐" }
    ];
    
    // Gestion du logo
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB max
                setErrors({ ...errors, logo: "L'image doit faire moins de 5MB" });
                return;
            }
            
            if (!file.type.startsWith("image/")) {
                setErrors({ ...errors, logo: "Veuillez uploader une image" });
                return;
            }
            
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setErrors({ ...errors, logo: "" });
        }
    };
    
    // Validation du formulaire
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!companyName.trim()) {
            newErrors.companyName = "Le nom de l'entreprise est requis";
        }
        
        if (!companyType) {
            newErrors.companyType = "Le type d'entreprise est requis";
        }
        
        if (!industry) {
            newErrors.industry = "Le secteur d'activité est requis";
        }
        
        // Validation SIRET (optionnel mais si rempli, doit être valide)
        if (siret && !/^\d{14}$/.test(siret.replace(/\s/g, ""))) {
            newErrors.siret = "Le SIRET doit contenir 14 chiffres";
        }
        
        // Validation TVA (optionnel mais si rempli, doit être valide)
        if (vatNumber && !validateVAT(vatNumber, country)) {
            newErrors.vatNumber = "Numéro de TVA invalide";
        }
        
        // Validation téléphone
        if (phone && !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(phone)) {
            newErrors.phone = "Numéro de téléphone invalide";
        }
        
        // Validation site web
        if (website && !/^https?:\/\/.+\..+/.test(website)) {
            newErrors.website = "URL de site web invalide";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Validation numéro de TVA
    const validateVAT = (vat: string, countryCode: string) => {
        // Format basique - en production, utiliser une validation plus poussée
        const vatRegex: Record<string, RegExp> = {
            "FR": /^FR[0-9]{11}$/,
            "BE": /^BE[0-9]{10}$/,
            "CH": /^CHE[0-9]{9}(MWST|TVA|IVA)?$/,
            "DE": /^DE[0-9]{9}$/,
            "ES": /^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/,
            "IT": /^IT[0-9]{11}$/,
            "GB": /^GB[0-9]{9}$|^GB[0-9]{12}$|^GBGD[0-9]{3}$|^GBHA[0-9]{3}$/,
        };
        
        const regex = vatRegex[countryCode];
        if (!regex) return true; // Pas de validation pour les autres pays
        
        return regex.test(vat.toUpperCase().replace(/\s/g, ""));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const companyData = {
            companyName,
            companyType,
            industry,
            siret: siret || null,
            vatNumber: vatNumber || null,
            address,
            city,
            postalCode,
            country,
            phone: phone || null,
            website: website || null,
            employeeCount,
            annualRevenue,
            shippingVolume,
            businessDescription,
            logo: logo ? URL.createObjectURL(logo) : null
        };
        
        console.log("Profil entreprise enregistré:", companyData);
        
        // Ici, vous pourriez envoyer les données à votre API
        // await saveCompanyProfile(companyData);
        
        next();
    };
    
    const isFormValid = () => {
        return companyName.trim() !== "" && 
               companyType !== "" && 
               industry !== "" &&
               employeeCount !== "" &&
               annualRevenue !== "" &&
               shippingVolume !== "";
    };
    
    // Effet pour la validation en temps réel
    useEffect(() => {
        if (vatNumber && country) {
            if (!validateVAT(vatNumber, country)) {
                setErrors({ ...errors, vatNumber: "Numéro de TVA invalide pour ce pays" });
            } else {
                const { vatNumber: _, ...rest } = errors;
                setErrors(rest);
            }
        }
    }, [vatNumber, country]);
    
    return (
        <div className="py-6 md:py-8">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                        <span className="text-xl text-white">🏢</span>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Profil de votre entreprise
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Complétez les informations de votre entreprise pour personnaliser votre expérience
                        </p>
                    </div>
                </div>
                
                {/* Indicateur de progression */}
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mr-3">
                        <div className="w-2/3 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                    <span>Remplissez au moins les champs obligatoires (*)</span>
                </div>
            </div>
            
            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Logo et identité */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="mr-2">🖼️</span>
                        Identité visuelle
                    </h3>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Upload de logo */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className={`
                                    w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center
                                    ${logoPreview 
                                        ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900' 
                                        : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                                    }
                                    hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer
                                `}
                                onClick={() => document.getElementById('logo-upload')?.click()}
                                >
                                    {logoPreview ? (
                                        <>
                                            <img 
                                                src={logoPreview} 
                                                alt="Logo preview" 
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">Modifier</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-3xl mb-2">📷</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                                                Cliquez pour uploader
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                PNG, JPG (max 5MB)
                                            </span>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </div>
                            {errors.logo && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.logo}</p>
                            )}
                        </div>
                        
                        {/* Nom de l'entreprise */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nom de l'entreprise *
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => {
                                        setCompanyName(e.target.value);
                                        if (errors.companyName) {
                                            setErrors({ ...errors, companyName: "" });
                                        }
                                    }}
                                    placeholder="Ex: MaSociété SARL"
                                    className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.companyName 
                                            ? 'border-red-500' 
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    required
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Le nom officiel de votre entreprise
                                </p>
                            </div>
                            
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description de l'activité
                                </label>
                                <textarea
                                    value={businessDescription}
                                    onChange={(e) => setBusinessDescription(e.target.value)}
                                    placeholder="Décrivez en quelques mots votre activité principale..."
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Cette description apparaîtra sur vos documents
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Section 2: Informations légales */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="mr-2">⚖️</span>
                        Informations légales
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type d'entreprise */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type d'entreprise *
                            </label>
                            <select
                                value={companyType}
                                onChange={(e) => {
                                    setCompanyType(e.target.value);
                                    if (errors.companyType) {
                                        setErrors({ ...errors, companyType: "" });
                                    }
                                }}
                                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.companyType 
                                        ? 'border-red-500' 
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                                required
                            >
                                <option value="">Sélectionnez un type</option>
                                {companyTypeOptions.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.companyType && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyType}</p>
                            )}
                        </div>
                        
                        {/* Secteur d'activité */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Secteur d'activité *
                            </label>
                            <select
                                value={industry}
                                onChange={(e) => {
                                    setIndustry(e.target.value);
                                    if (errors.industry) {
                                        setErrors({ ...errors, industry: "" });
                                    }
                                }}
                                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.industry 
                                        ? 'border-red-500' 
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                                required
                            >
                                <option value="">Sélectionnez un secteur</option>
                                {industryOptions.map((ind) => (
                                    <option key={ind} value={ind}>
                                        {ind}
                                    </option>
                                ))}
                            </select>
                            {errors.industry && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.industry}</p>
                            )}
                        </div>
                        
                        {/* SIRET */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Numéro SIRET
                            </label>
                            <input
                                type="text"
                                value={siret}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 14);
                                    setSiret(value);
                                    if (errors.siret) {
                                        setErrors({ ...errors, siret: "" });
                                    }
                                }}
                                placeholder="12345678901234"
                                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.siret 
                                        ? 'border-red-500' 
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.siret && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.siret}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                14 chiffres sans espace
                            </p>
                        </div>
                        
                        {/* Numéro de TVA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Numéro de TVA
                            </label>
                            <input
                                type="text"
                                value={vatNumber}
                                onChange={(e) => {
                                    setVatNumber(e.target.value.toUpperCase());
                                    if (errors.vatNumber) {
                                        setErrors({ ...errors, vatNumber: "" });
                                    }
                                }}
                                placeholder="FR12345678901"
                                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.vatNumber 
                                        ? 'border-red-500' 
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.vatNumber && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vatNumber}</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Section 3: Adresse et contact */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="mr-2">📍</span>
                        Adresse et contact
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Adresse */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Adresse
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="123 rue de l'Exemple"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Ville */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ville
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Paris"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Code postal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Code postal
                            </label>
                            <input
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                                placeholder="75000"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Pays */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pays
                            </label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {countryOptions.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Téléphone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (errors.phone) {
                                        setErrors({ ...errors, phone: "" });
                                    }
                                }}
                                placeholder="+33 1 23 45 67 89"
                                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.phone 
                                        ? 'border-red-500' 
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                            )}
                        </div>
                        
                        {/* Site web */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Site web
                            </label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => {
                                    setWebsite(e.target.value);
                                    if (errors.website) {
                                        setErrors({ ...errors, website: "" });
                                    }
                                }}
                                placeholder="https://www.exemple.com"
                                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.website 
                                        ? 'border-red-500' 
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.website && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Section 4: Métriques de l'entreprise */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="mr-2">📊</span>
                        Métriques de l'entreprise *
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Nombre d'employés */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre d'employés *
                            </label>
                            <div className="space-y-2">
                                {employeeOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setEmployeeCount(option)}
                                        className={`
                                            w-full p-3 text-left rounded-lg border transition-all
                                            ${employeeCount === option
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                            }
                                        `}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Chiffre d'affaires annuel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CA annuel *
                            </label>
                            <div className="space-y-2">
                                {revenueOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setAnnualRevenue(option)}
                                        className={`
                                            w-full p-3 text-left rounded-lg border transition-all
                                            ${annualRevenue === option
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-sm'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                            }
                                        `}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Volume d'expédition */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Volume d'expédition *
                            </label>
                            <div className="space-y-2">
                                {shippingVolumeOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setShippingVolume(option)}
                                        className={`
                                            w-full p-3 text-left rounded-lg border transition-all
                                            ${shippingVolume === option
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 shadow-sm'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                            }
                                        `}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Note sur les métriques */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-700 dark:text-gray-300">💡 Pourquoi ces informations ?</span><br />
                            Ces métriques nous permettent de mieux comprendre vos besoins et de vous proposer des fonctionnalités adaptées à la taille de votre entreprise.
                        </p>
                    </div>
                </div>
                
                {/* Aperçu du profil */}
                {(companyName || logoPreview) && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <span className="mr-2">👁️</span>
                            Aperçu de votre profil entreprise
                        </h3>
                        
                        <div className="flex items-start gap-6">
                            {logoPreview && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow">
                                    <img 
                                        src={logoPreview} 
                                        alt="Logo" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="flex-1">
                                {companyName && (
                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {companyName}
                                    </h4>
                                )}
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    {companyType && (
                                        <div className="flex items-center">
                                            <span className="mr-2">🏢</span>
                                            {companyType}
                                        </div>
                                    )}
                                    {industry && (
                                        <div className="flex items-center">
                                            <span className="mr-2">📋</span>
                                            {industry}
                                        </div>
                                    )}
                                    {employeeCount && (
                                        <div className="flex items-center">
                                            <span className="mr-2">👥</span>
                                            {employeeCount} employés
                                        </div>
                                    )}
                                    {city && (
                                        <div className="flex items-center">
                                            <span className="mr-2">📍</span>
                                            {city}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Boutons de navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700 gap-4">
                    <button
                        type="button"
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
                        Retour aux catégories
                    </button>
                    
                    <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Étape {currentStepId} sur 4
                            {!isFormValid() && (
                                <span className="ml-2 text-orange-600 dark:text-orange-400">
                                    (Champs requis manquants)
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!isFormValid()}
                            className={`
                                px-8 py-3 rounded-full font-semibold transition-all flex items-center
                                ${!isFormValid()
                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                }
                            `}
                        >
                            Enregistrer et continuer
                            <span className="ml-2">→</span>
                        </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        {Object.keys(errors).length > 0 ? (
                            <span className="text-red-600 dark:text-red-400">
                                {Object.keys(errors).length} erreur(s)
                            </span>
                        ) : (
                            <span className="text-green-600 dark:text-green-400">
                                ✓ Formulaire valide
                            </span>
                        )}
                    </div>
                </div>
            </form>

                        <div className="mt-6">
                            <OnboardingTabs
                                tabs={props.stepList}
                                getCurrentStep={props.getCurrentStep}
                            />
                        </div> 
        </div>
    );
};