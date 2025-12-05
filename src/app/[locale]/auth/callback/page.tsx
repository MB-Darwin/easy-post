/**
 * OAuth Callback Page
 * Handles OAuth redirect callback and token exchange
 */

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
// import { useValidateOAuthCallback } from "@/features/auth/api/auth.mutations";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  // const validateCallback = useValidateOAuthCallback();

  useEffect(() => {
    if (!searchParams) return;

    const code = searchParams.get("code");
    const companyId = searchParams.get("company_id");
    const timestamp = searchParams.get("timestamp");
    const hmac = searchParams.get("hmac");
    const redirectTo = searchParams.get("redirect_to");

    if (code && companyId && timestamp && hmac) {
      console.log("Auth callback received", {
        code,
        companyId,
        timestamp,
        hmac,
        redirectTo,
      });
      // validateCallback.mutate({
      //   code,
      //   company_id: companyId,
      //   timestamp,
      //   hmac,
      //   redirect_to: redirectTo ?? undefined,
      // });
    }
  }, [searchParams]);

  // if (validateCallback.isPending) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-semibold">Authenticating...</h2>
  //         <p className="mt-2 text-muted-foreground">
  //           Please wait while we complete your login
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (validateCallback.isError) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-semibold text-destructive">
  //           Authentication Failed
  //         </h2>
  //         <p className="mt-2 text-muted-foreground">
  //           {validateCallback.error.message ??
  //             "An error occurred during authentication"}
  //         </p>
  //         <button
  //           onClick={() => (window.location.href = "/login")}
  //           className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
  //         >
  //           Back to Login
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-yellow-600">
          Auth Maintenance
        </h2>
        <p className="mt-2 text-muted-foreground">
          Authentication is currently being updated. Please check back later.
        </p>
      </div>
    </div>
  );
}
