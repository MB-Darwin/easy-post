/**
 * Onboarding Page
 * Shown after successful OAuth authentication from Genuka
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Get company ID from cookies
    const cookies = document.cookie.split("; ");
    const companyIdCookie = cookies.find((c) => c.startsWith("company_id="));
    if (companyIdCookie) {
      setCompanyId(companyIdCookie.split("=")[1]);
    }
  }, []);

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl rounded-xl bg-white p-10 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome to Easy Post!
          </h1>
          <p className="text-gray-600">Your Genuka integration is now active</p>
        </div>

        <div className="mb-8 rounded-lg bg-green-50 p-4">
          <div className="flex items-center">
            <div className="mr-3 text-2xl">✅</div>
            <div>
              <h3 className="font-semibold text-green-800">
                Authentication Successful
              </h3>
              <p className="text-sm text-green-700">
                Connected to Genuka company: {companyId || "Loading..."}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">What's Next?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">📦</span>
              <span className="text-gray-700">
                Access products and inventory from Genuka
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">🛒</span>
              <span className="text-gray-700">Manage orders and customers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">📊</span>
              <span className="text-gray-700">View analytics and reports</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleContinue}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}
