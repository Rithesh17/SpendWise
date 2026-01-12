import { siteConfig } from '../../site.config.js';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
  // For now, we don't need content directories since we're building an app, not a content site
  // The navbar and footer will use the siteConfig directly
  
  return {
    globalDirectories: [],
    searchConfig: siteConfig.search || null,
    navbarConfig: siteConfig.navbar || null
  };
}
