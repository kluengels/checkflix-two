// define the routes that should be disallowed for web crawlers

import {getPathname, Locale, routing} from '@/i18n/routing';
import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  const entries = getEntries(['/movies', '/dashboard', '/series', '/privacy', '/contact', '/imprint', ]);
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: entries,
    },
  };
}

type Href = Parameters<typeof getPathname>[0]['href'];

// get main url for sitemap and alternate languages
function getEntries(hrefArray: Href[]) {
  const pathsOfEntry: string[] = [];
  for (const href of hrefArray) {
    pathsOfEntry.push(href.toString());

    routing.locales.forEach((locale) => {
      const localePath = getLocalePath(href, locale);
      if (localePath) {
        pathsOfEntry.push(localePath);
      }
    });
  }

  return pathsOfEntry;
}

function getLocalePath(href: Href, locale: Locale) {
  const pathname = getPathname({locale, href});
  const url = '/' + locale + pathname;
  return url;
}
