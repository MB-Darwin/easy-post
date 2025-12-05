import type messages from '../../../messages/en.json';
import type { formats } from './request';
import type { routing } from './routing';

declare module 'next-intl' {

  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
