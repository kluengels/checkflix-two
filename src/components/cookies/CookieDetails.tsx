import {Services, services} from '@/config/cookieConsent.config';
import {useTranslations} from 'next-intl';



/**
 * Redners details of a cookie service
 */
export default function CookieDetails({cookieDetails}: {cookieDetails: typeof services[Services]}) {
  const t = useTranslations('cookieConsent');
  return (
    <div className="max-w-full overflow-clip">
      {Object.entries(cookieDetails).map(([entry, value]) => {
        // loop through all the entries in the cookieDetails object
        // ignore everything that is already displayed before
        if (entry === 'name' || entry === 'category' || entry === 'title') return null; // set link for data protection and contact

        if (entry === 'dataProtection' || entry === 'contact') {
          // check if the value is an email adress with regex
          const isMail = value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
          return (
            <div key={entry} className="mb-2">
              <p className="text-sm font-medium mb-0">{t(`cookieDescription.${entry}`)}</p>
              <a href={isMail ? `mailto:${value}` : value} target="_blank" className="text-sm text-muted-foreground mt-0 break-all ">{`${value}`}</a>
            </div>
          );
        } // render all other values, like description, company, etc.

        return (
          <div key={entry}>
            <p className="text-sm font-medium mb-0">{t(`cookieDescription.${entry}`)}</p>
            <p className="text-sm text-muted-foreground mt-0 ">{t(`${value}`)}</p>
          </div>
        );
      })}
    </div>
  );
}
