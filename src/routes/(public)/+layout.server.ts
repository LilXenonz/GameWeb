import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, url }) => {
  return {
    theme: cookies.get('theme') || 'light',
    currentPath: url.pathname
  };
}) satisfies LayoutServerLoad;