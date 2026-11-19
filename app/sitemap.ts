import type { MetadataRoute } from 'next';
import { getServices } from '@/lib/data/services';
import { getIndustries } from '@/lib/data/industries';
import { getOpenJobs, getPublishedCaseStudies } from '@/lib/data/content-repo';
import { SITE_URL } from '@/lib/utils/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, industries, jobs, caseStudies] = await Promise.all([
    getServices(),
    getIndustries(),
    getOpenJobs(),
    getPublishedCaseStudies(),
  ]);

  const staticRoutes = [
    '',
    '/services',
    '/industries',
    '/how-it-works',
    '/about',
    '/team',
    '/contact',
    '/book-consultation',
    '/careers',
    '/resources',
    '/resources/case-studies',
    '/resources/success-stories',
    '/resources/insights',
    '/resources/faqs',
    '/privacy',
    '/terms',
    '/accessibility',
    '/security',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: new Date() }));
  const industryRoutes = industries.map((i) => ({ url: `${SITE_URL}/industries/${i.slug}`, lastModified: new Date() }));
  const jobRoutes = (jobs as any[]).map((j) => ({ url: `${SITE_URL}/careers/${j.slug}`, lastModified: new Date() }));
  const caseStudyRoutes = (caseStudies as any[]).map((c) => ({
    url: `${SITE_URL}/resources/case-studies/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...jobRoutes, ...caseStudyRoutes];
}
