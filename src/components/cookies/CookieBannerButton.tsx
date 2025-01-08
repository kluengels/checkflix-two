// renders button to open Cookie Banner, "footer" variant is plain link, "default" variant is a button

'use client';

import {useState} from 'react';
import {Button} from '../ui/button';
import CookieConsentBanner from './CookieConsentBanner';
import {useTranslations} from 'next-intl';

export default function CookieBannerButton({variant, className}: {variant?: 'footer' | 'default'; className?: string}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('cookieConsent');

  return (
    <>
      {variant === 'footer' ? (
        <Button variant="link" className={className} onClick={() => setIsOpen(true)}>
          {t('openButton')}
        </Button>
      ) : (
        <Button onClick={() => setIsOpen(true)}>{t('openButton')}</Button>
      )}
      <CookieConsentBanner open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
