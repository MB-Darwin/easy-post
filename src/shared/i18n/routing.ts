import { defineRouting } from "next-intl/routing";

import { APP_CONFIG } from "@/shared/constants/app-config";

export const routing = defineRouting({
  locales: APP_CONFIG.locales,
  localePrefix: APP_CONFIG.localePrefix,
  defaultLocale: APP_CONFIG.defaultLocale,
});
