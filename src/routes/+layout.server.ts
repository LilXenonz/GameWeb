// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import { getUser } from '$lib/auth.js'

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // HÄMTA ANVÄNDARDATA FÖR ATT SE OM NÅGON ÄR INLOGGAD
  const user = await getUser(cookies)
  
  return {
    theme: cookies.get('theme') || 'dark',
    currentPath: url.pathname,
    user // USER ÄR NULL OM INGEN ÄR INLOGGAD
  }
}