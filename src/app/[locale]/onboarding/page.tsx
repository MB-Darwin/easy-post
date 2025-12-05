import { OnboardingFlow } from "@/shared/components/onboarding/onboarding-flow";
import { redirect } from "@/shared/i18n";
import { requireAuth } from "@/shared/lib/auth";
import { getLocale } from "next-intl/server";

export default async function Home() {
  // const company = await requireAuth();
  // const locale = await getLocale();

  // if (!company.isFirstLogin) {
  //   return redirect({
  //     href: "/console",
  //     locale,
  //   });
  // }

  return <OnboardingFlow />;
}
