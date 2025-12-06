"use client";

import React, { useState } from "react";
import { baseComponentProps } from "../types/onboarding-steps-list";
import { OnboardingTabs } from "../../tabs/onboardingTabs";


export const WorkspaceStep = (props: baseComponentProps) => {
  const { next, prev, isFirstStep, isFinalStep, currentStepId } = props;

  // États pour le workspace
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, email: "", role: "member" },
  ]);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    webhook: false,
    dashboard: true,
  });
  const [dataRetention, setDataRetention] = useState("90");
  const [theme, setTheme] = useState("light");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [currency, setCurrency] = useState("EUR");

  // Options disponibles
  const roleOptions = [
    { value: "admin", label: "Administrateur", description: "Accès complet" },
    { value: "manager", label: "Manager", description: "Gestion d'équipe" },
    { value: "member", label: "Membre", description: "Accès standard" },
    { value: "viewer", label: "Observateur", description: "Lecture seule" },
  ];

  const timezoneOptions = [
    "Europe/Paris",
    "Europe/London",
    "Europe/Berlin",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Tokyo",
    "Australia/Sydney",
    "UTC",
  ];

  const currencyOptions = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "Dollar US" },
    { code: "GBP", symbol: "£", name: "Livre Sterling" },
    { code: "CAD", symbol: "CA$", name: "Dollar Canadien" },
    { code: "CHF", symbol: "CHF", name: "Franc Suisse" },
  ];

  const themeOptions = [
    { value: "light", label: "Clair", icon: "☀️" },
    { value: "dark", label: "Sombre", icon: "🌙" },
    { value: "auto", label: "Auto", icon: "⚙️" },
  ];

  // Ajouter un membre d'équipe
  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { id: Date.now(), email: "", role: "member" },
    ]);
  };

  // Supprimer un membre d'équipe
  const removeTeamMember = (id: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
    }
  };

  // Mettre à jour un membre d'équipe
  const updateTeamMember = (id: number, field: string, value: string) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  // Toggle notification
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  // Validation du formulaire
  const isFormValid = () => {
    const validWorkspaceName = workspaceName.trim().length >= 3;
    const validTeamMembers = teamMembers.every(
      (member) => member.email.includes("@") && member.email.includes(".")
    );
    return validWorkspaceName && validTeamMembers;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workspaceData = {
      workspaceName,
      workspaceUrl,
      teamMembers,
      notifications,
      dataRetention: parseInt(dataRetention),
      theme,
      timezone,
      currency,
    };

    console.log("Workspace configuré:", workspaceData);

    // Ici, vous pourriez envoyer les données à votre API
    // await saveWorkspaceConfig(workspaceData);

    next();
  };

  // Générer l'URL suggérée
  const generateSuggestedUrl = () => {
    if (workspaceName.trim()) {
      const baseUrl = workspaceName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      setWorkspaceUrl(`${baseUrl}.easypost.com`);
    }
  };

  return (
    <div className="py-6 md:py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Configurez votre Workspace
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Personnalisez votre espace de travail pour votre équipe
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Configuration du workspace */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">🏢</span>
            Informations du workspace
          </h3>

          <div className="space-y-6">
            {/* Nom du workspace */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de votre workspace *
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onBlur={generateSuggestedUrl}
                  placeholder="Ex: MonEntreprise Logistique"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  minLength={3}
                />
                <button
                  type="button"
                  onClick={generateSuggestedUrl}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Générer l'URL
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ce nom sera visible par tous les membres de votre équipe
              </p>
            </div>

            {/* URL du workspace */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL personnalisée
              </label>
              <div className="flex items-center">
                <span className="p-3 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-600 dark:text-gray-400">
                  https://
                </span>
                <input
                  type="text"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                  placeholder="votre-workspace.easypost.com"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Vous pourrez toujours modifier cette URL plus tard
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Membres de l'équipe */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="mr-2">👥</span>
              Inviter votre équipe
            </h3>
            <button
              type="button"
              onClick={addTeamMember}
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium transition-colors flex items-center"
            >
              <span className="mr-2">+</span>
              Ajouter un membre
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Invitez vos collègues à rejoindre votre workspace. Ils recevront un
            email d'invitation.
          </p>

          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email {index === 0 && "(vous)"} *
                  </label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      updateTeamMember(member.id, "email", e.target.value)
                    }
                    placeholder="collaborateur@entreprise.com"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rôle
                  </label>
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateTeamMember(member.id, "role", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  {teamMembers.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member.id)}
                      className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-3">
                      Vous êtes le premier membre
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
              <span className="mr-2">💡</span>À propos des rôles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {roleOptions.map((role) => (
                <div key={role.value} className="text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {role.label}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    {role.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Préférences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-2">⚙️</span>
            Préférences
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notifications
              </h4>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {getNotificationLabel(key)}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getNotificationDescription(key)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        toggleNotification(key as keyof typeof notifications)
                      }
                      className={`
                                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                                ${
                                                  value
                                                    ? "bg-indigo-600"
                                                    : "bg-gray-300 dark:bg-gray-600"
                                                }
                                            `}
                    >
                      <span
                        className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${
                                                  value
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                                }
                                            `}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Autres préférences */}
            <div className="space-y-6">
              {/* Thème */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Apparence
                </h4>
                <div className="flex gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className={`
                                                flex-1 p-4 rounded-lg border-2 flex flex-col items-center transition-all
                                                ${
                                                  theme === option.value
                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                                }
                                            `}
                    >
                      <span className="text-2xl mb-2">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timezone et Devise */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuseau horaire
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {timezoneOptions.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Devise par défaut
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {currencyOptions.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name} ({curr.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rétention des données */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rétention des données: {dataRetention} jours
                </label>
                <input
                  type="range"
                  min="30"
                  max="365"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>30 jours</span>
                  <span>1 an</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Aperçu */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">👁️</span>
            Aperçu de votre workspace
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Configuration résumée
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  📁 Workspace: <strong>{workspaceName || "Non défini"}</strong>
                </li>
                <li>
                  👥 Membres: <strong>{teamMembers.length} personne(s)</strong>
                </li>
                <li>
                  🌐 Thème:{" "}
                  <strong>
                    {themeOptions.find((t) => t.value === theme)?.label}
                  </strong>
                </li>
                <li>
                  💰 Devise: <strong>{currency}</strong>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Prochaines étapes
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Invitations envoyées aux membres
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Dashboard personnalisé créé
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Intégrations configurées
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700 gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={isFirstStep}
            className={`
                            px-6 py-3 rounded-full font-medium transition-all flex items-center
                            ${
                              isFirstStep
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }
                        `}
          >
            <span className="mr-2">←</span>
            Retour au profil entreprise
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Étape {currentStepId} sur 4 • Dernière étape
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`
                                px-8 py-3 rounded-full font-semibold transition-all flex items-center
                                ${
                                  !isFormValid()
                                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                }
                            `}
            >
              Créer mon workspace
              <span className="ml-2">✨</span>
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {teamMembers.length} membre(s) invité(s)
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

// Fonctions utilitaires
const getNotificationLabel = (key: string) => {
  const labels: Record<string, string> = {
    email: "Email",
    slack: "Slack",
    webhook: "Webhook",
    dashboard: "Dashboard",
  };
  return labels[key] || key;
};

const getNotificationDescription = (key: string) => {
  const descriptions: Record<string, string> = {
    email: "Notifications par email",
    slack: "Intégration Slack",
    webhook: "Webhooks personnalisés",
    dashboard: "Notifications dans l'application",
  };
  return descriptions[key] || "";
};
