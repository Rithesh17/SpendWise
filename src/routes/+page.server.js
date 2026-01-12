// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  // Dashboard page - no server data needed for now
  // Will be updated in Phase 2 to load expenses from stores
  return {};
}
