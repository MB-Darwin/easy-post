// src/components/Auth/TestFacebookButton.tsx
"use client";

export default function TestFacebookButton() {
  const handleTest = async () => {
    try {
      console.log("🎯 Test OAuth Facebook démarré...");

      // Option 1: Utiliser la route d'init
      window.location.href = "/api/auth/facebook/init";

      // Option 2: Accéder directement au callback avec un code mock
      // window.location.href = "/api/auth/facebook?code=test_code_123";
    } catch (error) {
      console.error("Erreur de test:", error);
      alert("Erreur de test: " + error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Test Facebook OAuth</h2>
      <p className="mb-4 text-gray-600">
        Mode:{" "}
        <span className="font-semibold text-green-600">DÉVELOPPEMENT</span>
      </p>

      <button
        onClick={handleTest}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        🔧 Tester la connexion Facebook (Mode Développement)
      </button>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Cliquez sur le bouton</li>
          <li>Vérifiez la console du navigateur</li>
          <li>Vérifiez la console du serveur Next.js</li>
          <li>Vous devriez être redirigé vers /dashboard</li>
          <li>Vérifiez la table social_accounts dans votre base de données</li>
        </ol>
      </div>
    </div>
  );
}
