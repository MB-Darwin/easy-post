/**
 * Unauthorized Page
 * Shown when user tries to access protected routes without authentication
 */

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">🔒</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Unauthorized Access
        </h1>
        <p className="mb-6 text-gray-600">
          You need to be authenticated to access this page.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Go to Home
          </Link>
          <Link
            href="/auth/login"
            className="block rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            Login with Genuka
          </Link>
        </div>
      </div>
    </div>
  );
}
