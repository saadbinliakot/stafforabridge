import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = buildMetadata({
  title: 'FAQs',
  description: 'Searchable frequently asked questions about NOVALINK.',
  path: '/resources/faqs',
});

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
