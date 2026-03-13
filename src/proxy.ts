import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)'
  ]
};
