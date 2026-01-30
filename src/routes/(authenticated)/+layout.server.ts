import type { LayoutServerLoad } from '../$types'
import { redirect } from '@sveltejs/kit'
import { getUser } from '$lib/auth.js'
import prisma from '$lib/prisma.js'

export const load: LayoutServerLoad = async ({ cookies, parent }) => {
  // HÄMTA DATA FRÅN PARENT LAYOUT
  const parentData = await parent()

  // KONTROLLERA ATT ANVÄNDAREN ÄR INLOGGAD
  const user = await getUser(cookies)

  if (!user) {
    throw redirect(307, '/login')
  }

  // Fetch stats for the sidebar
  const [characterCount, gameCount, winCount] = await Promise.all([
    prisma.character.count({ where: { userId: user.id } }),
    prisma.game.count({ where: { userId: user.id } }),
    prisma.game.count({ where: { userId: user.id, won: true } })
  ])

  return {
    user,
    stats: {
      characterCount,
      gameCount,
      winCount
    }
  }
}
