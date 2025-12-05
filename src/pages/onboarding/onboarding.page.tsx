import { getTranslations } from "next-intl/server";

export default async function OnboardingPageContent() {
  const t = await getTranslations("homepage");
  return <div>{t("welcome")}</div>;
}
