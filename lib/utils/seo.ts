import type { Metadata } from 'next';

const SITE_NAME = 'NOVALINK';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.novalink.example';
const DEFAULT_DESCRIPTION =
  'NOVALINK is a USA-Canada based healthcare outsourcing company providing operational, administrative, and back-office support to healthcare organizations worldwide.';

export function buildMetadata(opts: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description = DEFAULT_DESCRIPTION, path = '/', noIndex = false } = opts;
  const url = `${SITE_URL}${path}`;
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

export { SITE_NAME, SITE_URL };
