// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import { getUser } from '$lib/auth.js'

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Check if user is logged in
  const user = await getUser(cookies)

  return {
    theme: cookies.get('theme') || 'dark',
    currentPath: url.pathname,
    user // null if not logged in
  }
}