// src/app/test-facebook/page.tsx
import TestFacebookButton from "@/app/api/auth/facebook/components/Auth/TestFacebookButton";

export default function TestFacebookPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Test d'intégration Facebook OAuth
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Mode Développement</h2>
            <p className="mb-4">
              Ce mode simule Facebook OAuth sans besoin de configurer Facebook
              Developers.
            </p>
            <TestFacebookButton />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Instructions complètes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">1. Pour tester maintenant:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li>Cliquez sur le bouton à gauche</li>
                  <li>Ouvrez les DevTools (F12)</li>
                  <li>Vérifiez les logs dans la console</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">
                  2. Vérifier la base de données:
                </h3>
                <code className="text-sm bg-gray-100 p-2 block rounded">
                  SELECT * FROM social_accounts ORDER BY created_at DESC;
                </code>
              </div>

              <div>
                <h3 className="font-semibold">3. Pour la production:</h3>
                <ol className="list-decimal list-inside text-sm">
                  <li>Créez une app sur developers.facebook.com</li>
                  <li>Ajoutez le produit "Facebook Login"</li>
                  <li>Configurez les URLs de redirection</li>
                  <li>Mettez à jour les variables d'environnement</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
