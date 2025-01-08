// load cookie banner on first visit

'use client';

import {useState} from 'react';
import CookieConsentBanner from './CookieConsentBanner';

export default function CookieBannerInit() {
  const [showBanner, setShowBanner] = useState(true);

  return <CookieConsentBanner open={showBanner} onOpenChange={setShowBanner} />;
}
