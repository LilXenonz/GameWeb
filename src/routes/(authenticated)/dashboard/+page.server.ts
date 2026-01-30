import type { PageServerLoad, Actions } from './$types'
import { requireAuth } from '$lib/auth.js'
import prisma from '$lib/prisma.js'
import { fail } from '@sveltejs/kit'
import * as crypto from 'crypto'

export const load: PageServerLoad = async ({ cookies }) => {
  const user = await requireAuth(cookies)

  const stats = await prisma.character.aggregate({
    where: { userId: user.id },
    _count: { id: true },
    _sum: { totalGames: true, wins: true, losses: true }
  })

  return {
    user,
    stats: {
      characterCount: stats._count.id,
      totalGames: stats._sum.totalGames || 0,
      totalWins: stats._sum.wins || 0,
      totalLosses: stats._sum.losses || 0
    }
  }
}

export const actions: Actions = {
  updateProfile: async ({ request, cookies }) => {
    const user = await requireAuth(cookies)
    const data = await request.formData()
    const username = data.get('username')?.toString()
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()

    if (!username || !email) {
      return fail(400, { message: 'Användarnamn och email är obligatoriska' })
    }

    const updateData: any = { username, email }

    if (password && password.length > 0) {
      if (password.length < 8) {
        return fail(400, { message: 'Lösenordet måste vara minst 8 tecken' })
      }

      const iterations = 10000
      const salt = crypto.randomBytes(16)
      const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512')
      
      updateData.salt = salt.toString('hex')
      updateData.hash = hash.toString('hex')
      updateData.plainPassword = null
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })

      return { success: true, message: 'Profilen uppdaterad' }
    } catch (error) {
      return fail(500, { message: 'Kunde inte uppdatera profilen' })
    }
  },

  uploadImage: async ({ request, cookies }) => {
    const user = await requireAuth(cookies)
    const data = await request.formData()
    const imageFile = data.get('image') as File

    if (!imageFile || imageFile.size === 0) {
      return fail(400, { message: 'Välj en bildfil' })
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return fail(400, { message: 'Bilden får inte vara större än 5MB' })
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(imageFile.type)) {
      return fail(400, { message: 'Endast JPEG, PNG, GIF och WebP är tillåtna' })
    }

    try {
      const buffer = await imageFile.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      await prisma.user.update({
        where: { id: user.id },
        data: { profileImage: base64 }
      })

      return { success: true, message: 'Bild uppladdad' }
    } catch (error) {
      return fail(500, { message: 'Kunde inte ladda upp bilden' })
    }
  },

  removeImage: async ({ cookies }) => {
    const user = await requireAuth(cookies)

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { profileImage: null }
      })

      return { success: true, message: 'Bild borttagen' }
    } catch (error) {
      return fail(500, { message: 'Kunde inte ta bort bilden' })
    }
  }
}
