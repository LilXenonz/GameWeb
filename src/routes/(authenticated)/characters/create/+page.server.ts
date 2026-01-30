import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { requireAuth } from '$lib/auth.js'
import prisma from '$lib/prisma.js'

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const user = await requireAuth(cookies)
    const formData = await request.formData()

    const name = formData.get('name')?.toString()
    const description = formData.get('description')?.toString()

    if (!name) {
      return fail(400, { error: 'Name is required' })
    }

    // Handle image upload
    let imageId = null
    const imageFile = formData.get('image') as File

    if (imageFile && imageFile.size > 0) {
      try {
        const buffer = await imageFile.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')

        // Create image record
        const image = await prisma.image.create({
          data: {
            name: imageFile.name,
            type: imageFile.type,
            data: base64,
            size: imageFile.size,
            userId: user.id
          }
        })

        imageId = image.id
      } catch (error) {
        console.error('Image upload error:', error)
        // Continue without image if upload fails
      }
    }

    try {
      await prisma.character.create({
        data: {
          name,
          description,
          imageId: imageId, // Connect via imageId
          userId: user.id
        }
      })
    } catch (error) {
      console.error('Create character error:', error)
      return fail(500, { error: 'Failed to create character' })
    }

    throw redirect(303, '/characters')
  }
}
