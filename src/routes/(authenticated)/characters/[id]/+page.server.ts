import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { requireAuth } from '$lib/auth.js'
import prisma from '$lib/prisma.js'

export const load: PageServerLoad = async ({ params, cookies }) => {
  const user = await requireAuth(cookies)
  
  const character = await prisma.character.findUnique({
    where: { id: params.id }
  })
  
  if (!character || character.userId !== user.id) {
    throw redirect(303, '/characters')
  }
  
  const games = await prisma.game.findMany({
    where: { characterId: params.id },
    orderBy: { createdAt: 'desc' }
  })
  
  return { character, games }
}

export const actions: Actions = {
  default: async ({ params, request, cookies }) => {
    const user = await requireAuth(cookies)
    const formData = await request.formData()
    
    const won = formData.get('won') === 'true'
    const opponent = formData.get('opponent')?.toString()
    const note = formData.get('note')?.toString()
    
    try {
      // Create game
      await prisma.game.create({
        data: {
          won,
          opponent,
          note,
          characterId: params.id,
          userId: user.id
        }
      })
      
      // Update character stats
      await prisma.character.update({
        where: { id: params.id },
        data: {
          totalGames: { increment: 1 },
          wins: { increment: won ? 1 : 0 },
          losses: { increment: won ? 0 : 1 }
        }
      })
      
    } catch (error) {
      console.error('Add game error:', error)
      return fail(500, { error: 'Failed to add game' })
    }
    
    // Reload the page
    throw redirect(303, `/characters/${params.id}`)
  }
}
