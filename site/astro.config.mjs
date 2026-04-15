// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.digitalpsychedelics.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'zh', 'ja', 'fr'],
    routing: { prefixDefaultLocale: false }
  }
});
