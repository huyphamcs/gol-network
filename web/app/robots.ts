import type { MetadataRoute } from 'next';
import { publicOrigin } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/app',
      disallow: ['/app/api/', '/app/preview', '/app/tokenized-stocks'],
    },
    sitemap: `${publicOrigin}/app/sitemap.xml`,
    host: publicOrigin,
  };
}
