/**
 * Centralized company information for Atlas BioLabs
 * Used throughout the site for contact details, schema, footer, emails, and COA branding
 */

export const COMPANY_INFO = {
  name: "Atlas BioLabs",
  legalName: "Atlas BioLabs",
  website: "https://www.atlasbiolabs.co",
  phoneDisplay: "+1 805 941 0541",
  phoneE164: "+18059410541",
  email: "sales@atlasbiolabs.co", // primary contact email

  // US Office (headquarters)
  usOffice: {
    label: "United States Office",
    streetAddress: "29520 Kohoutek Way",
    addressLocality: "Union City",
    addressRegion: "CA",
    postalCode: "94587",
    addressCountry: "US",
    formatted: "29520 Kohoutek Way, Union City, CA 94587, United States",
  },

  // China Office (operations/sourcing)
  chinaOffice: {
    label: "China Operations / Sourcing Office",
    streetAddress: "No.333 Guiping Road",
    addressLocality: "Shanghai",
    addressCountry: "CN",
    formatted: "No.333 Guiping Road, Shanghai, China",
  },

  // Tagline/slogan
  tagline: "Global Peptide Supply & Sourcing",

  // Company description for schema
  description:
    "Atlas BioLabs supports qualified B2B buyers with commercial peptide sourcing, MOQ guidance, batch documentation, quality communication, and operations in the United States and China.",

  // Short description for marketing
  shortDescription:
    "Atlas BioLabs provides commercial peptide sourcing, MOQ support, batch documentation, and quote-led supply support for qualified B2B buyers.",

  // For NAP consistency (Name, Address, Phone)
  nap: {
    name: "Atlas BioLabs",
    addressPrimary: "29520 Kohoutek Way, Union City, CA 94587, United States",
    addressSecondary: "No.333 Guiping Road, Shanghai, China",
    phone: "+1 805 941 0541",
    phoneE164: "+18059410541",
  },
};

/**
 * Contact point information for organization schema
 */
export const CONTACT_POINTS = [
  {
    type: "ContactPoint",
    contactType: "sales",
    telephone: COMPANY_INFO.phoneE164,
    areaServed: ["US", "CN", "International"],
    availableLanguage: ["English"],
  },
  {
    type: "ContactPoint",
    contactType: "customer support",
    telephone: COMPANY_INFO.phoneE164,
    areaServed: ["US", "CN", "International"],
    availableLanguage: ["English"],
  },
];

/**
 * Postal addresses for organization schema
 */
export const POSTAL_ADDRESSES = [
  {
    type: "PostalAddress",
    streetAddress: COMPANY_INFO.usOffice.streetAddress,
    addressLocality: COMPANY_INFO.usOffice.addressLocality,
    addressRegion: COMPANY_INFO.usOffice.addressRegion,
    postalCode: COMPANY_INFO.usOffice.postalCode,
    addressCountry: COMPANY_INFO.usOffice.addressCountry,
  },
  {
    type: "PostalAddress",
    streetAddress: COMPANY_INFO.chinaOffice.streetAddress,
    addressLocality: COMPANY_INFO.chinaOffice.addressLocality,
    addressCountry: COMPANY_INFO.chinaOffice.addressCountry,
  },
];

/**
 * Default COA/document branding settings
 */
export const DEFAULT_COA_BRANDING = {
  company: COMPANY_INFO.name,
  phone: COMPANY_INFO.phoneDisplay,
  website: COMPANY_INFO.website,
  usOfficeLabel: COMPANY_INFO.usOffice.label,
  usOfficeAddress: COMPANY_INFO.usOffice.formatted,
  chinaOfficeLabel: COMPANY_INFO.chinaOffice.label,
  chinaOfficeAddress: COMPANY_INFO.chinaOffice.formatted,
  recipientEmail: COMPANY_INFO.email,
  complianceFooter:
    "This document is for commercial research purposes only. Not intended for human consumption.",
};
