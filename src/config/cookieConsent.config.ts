export type Service = {
  name: string; // short name used in cookies
  category: "functional" | "statistics" | "marketing" | "necessary"; // category of the service
  title: string; // full name of the service
  description: string; // description of the service (has to be translated)
  company: string; // name of the processing company
  companyAddress: string; // adress of the processing company
  contact: string; // contact details of the data protection officer
  purpose: string; // purpose of data collection (has to be translated)
  technologies: string; // technologies used for data collection
  dataCollected: string;
  legalBasis: string; // paragraph of the legal basis
  placeOfProcessing: string;
  storagePeriod: string;
  dataTransfer?: string; // transfern to third countires
  dataRecipients: string;
  dataProtection: string; // link to the data protection provisions of the data processing company
};

export const services = {
  language: {
    name: "language",
    category: "necessary",
    title: "Next Locale",
    description: "language.description",
    company: "language.company",
    companyAddress: "language.companyAddress",
    contact: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    purpose: "language.purpose",
    technologies: "language.technologies",
    dataCollected: "language.dataCollected",
    legalBasis: "language.legalBasis",
    placeOfProcessing: "language.placeOfProcessing",
    storagePeriod: "language.storagePeriod",
    dataRecipients: "language.dataRecipients",
    dataProtection: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
  },
  // cookies: {
  //   name: "cookies",
  //   category: "necessary",
  //   title: "Cookie Consent",
  //   description: "cookies.description",
  //   company: "cookies.company",
  //   companyAddress: "cookies.companyAddress",
  //   contact: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
  //   purpose: "cookies.purpose",
  //   technologies: "cookies.technologies",
  //   dataCollected: "cookies.dataCollected",
  //   legalBasis: "cookies.legalBasis",
  //   placeOfProcessing: "cookies.placeOfProcessing",
  //   storagePeriod: "cookies.storagePeriod",
  //   dataRecipients: "cookies.dataRecipients",
  //   dataProtection: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
  // },
  theme: {
    name: "theme",
    category: "necessary",
    title: "Next-UI-Theme",
    description: "theme.description",
    company: "theme.company",
    companyAddress: "theme.companyAddress",
    contact: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    purpose: "theme.purpose",
    technologies: "theme.technologies",
    dataCollected: "theme.dataCollected",
    legalBasis: "theme.legalBasis",
    placeOfProcessing: "theme.placeOfProcessing",
    storagePeriod: "theme.storagePeriod",
    dataRecipients: "theme.dataRecipients",
    dataProtection: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
  },
  umami: {
    name: "umami",
    category: "necessary",
    title: "Umami (Self-Hosted)",
    description: "umami.description",
    company: "umami.company",
    companyAddress: "umami.companyAddress",
    contact: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    purpose: "umami.purpose",
    technologies: "umami.technologies",
    dataCollected: "umami.dataCollected",
    legalBasis: "umami.legalBasis",
    placeOfProcessing: "umami.placeOfProcessing",
    storagePeriod: "umami.storagePeriod",
    dataRecipients: "umami.dataRecipients",
    dataProtection: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
  },
  storage: {
    name: "storage",
    category: "necessary",
    title: "Browser Storage",
    description: "storage.description",
    company: "storage.company",
    companyAddress: "storage.companyAddress",
    contact: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    purpose: "storage.purpose",
    technologies: "storage.technologies",
    dataCollected: "storage.dataCollected",
    legalBasis: "storage.legalBasis",
    placeOfProcessing: "storage.placeOfProcessing",
    storagePeriod: "storage.storagePeriod",
    dataRecipients: "storage.dataRecipients",
    dataProtection: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
  },
};

export type Services = keyof typeof services;

export const defaultConsent: CookieConsent = {
  necessary: {
    enabled: true,
    services: {
      cookies: true,
      language: true,
      theme: true,
      umami: true,
      storage: true,
    },
  },
  // functional: {
  //   enabled: false,
  //   services: {
  //     osm: false,
  //     youtube: false,
  //     mapbox: false,
  //   },
  // },
  // statistics: {
  //   enabled: false,
  //   services: {
  //     umami: false,
  //   },
  // },
  // marketing: {
  //   enabled: false,
  //   services: {},
  // },
};

export type Category = {
  enabled: boolean;
  services?: Record<string, boolean>;
};

export type CookieConsent = {
  necessary: Category;
  // functional: Category;
  // statistics: Category;
  // marketing: Category;
};

export type CategoryConsent = {
  categories: CookieConsent;
};

export const categories: Categories[] = Object.keys(
  defaultConsent,
) as Categories[];
export type Categories = keyof typeof defaultConsent;
