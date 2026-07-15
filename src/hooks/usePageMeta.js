import { useEffect } from 'react';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  PRODUCT_NAME,
  SITE_URL,
} from '@/data/brand-copy';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets document title, description, Open Graph, canonical, and JSON-LD per route.
 */
export function usePageMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
} = {}) {
  useEffect(() => {
    const fullTitle = title.includes(PRODUCT_NAME) ? title : `${title} · ${PRODUCT_NAME}`;
    const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', PRODUCT_NAME);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'robots', 'index, follow');
    upsertLink('canonical', canonical);

    upsertJsonLd('ayursense-jsonld', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: PRODUCT_NAME,
          url: SITE_URL,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          description,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'WebPage',
          name: fullTitle,
          description,
          url: canonical,
          isPartOf: { '@type': 'WebSite', name: PRODUCT_NAME, url: SITE_URL },
        },
      ],
    });
  }, [title, description, path, type]);
}
