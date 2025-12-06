import { OnboardingContainer } from '@/pages/onboarding/onboarding.container';
import React from 'react';

// Définissez un type pour company
interface Company {
  name: string;
  description?: string;
}

export default function HomePage() {
  // Valeur par défaut pour company
  const company: Company = {
    name: "EasyPost", // Nom par défaut
    description: "Votre plateforme de gestion de courrier"
  };

  // Ou si vous récupérez les données d'une API :
  // const company = await getCompanyData();
  
  // Vérifiez que company n'est pas null
  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black text-black dark:text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Chargement...</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Veuillez patienter pendant le chargement des données.
          </p>
        </div>
      </div>
    );
  }

  return (

    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black text-black dark:text-white p-4 md:p-8">
    //   <div className="max-w-7xl mx-auto">
        
    //     {/* Header */}
    //     <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-12">
    //       <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 text-nowrap">
    //         Welcome To {company.name}
    //       </h1>
    //       <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
    //         Looking for a starting point or more instructions? Head over to{" "}
    //         <a 
    //           href="https://docs.easypost.com" 
    //           className="text-blue-600 dark:text-blue-400 hover:underline"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           our documentation
    //         </a>{" "}
    //         to get started.
    //       </p>
    //     </div>

    //     {/* Hero Section */}
    //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
    //       <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    //         <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
    //         <p className="text-gray-600 dark:text-gray-300">
    //           {company.description || "A powerful platform for managing your mail and packages efficiently."}
    //         </p>
    //       </div>
          
    //       <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    //         <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
    //         <div className="space-y-3">
    //           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
    //             Get Started
    //           </button>
    //           <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-3 rounded-lg font-medium transition-colors">
    //             View Documentation
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Features */}
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //       {[
    //         { title: "Easy Integration", desc: "Seamless API integration" },
    //         { title: "Real-time Tracking", desc: "Track your packages live" },
    //         { title: "Secure Platform", desc: "Enterprise-grade security" }
    //       ].map((feature, index) => (
    //         <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    //           <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
    //           <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
    //         </div>
    //       ))}
    //     </div>

    //     {/* Navigation Links */}
    //     <div className="mt-12 flex flex-wrap gap-4 justify-center">
    //       <a 
    //         href="/dashboard" 
    //         className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
    //       >
    //         Go to Dashboard
    //       </a>
    //       <a 
    //         href="/login" 
    //         className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
    //       >
    //         Login
    //       </a>
    //     </div>

    //   </div>
    // </div>
    <>
      <OnboardingContainer />
    </>


  );
}