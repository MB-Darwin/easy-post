import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const APP_CONFIG = {
  name: 'Nextjs Starter',
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,
};
