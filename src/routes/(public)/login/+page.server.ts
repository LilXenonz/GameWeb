import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from '@sveltejs/kit'
import prisma from '$lib/prisma.js'
import * as crypto from 'node:crypto'

// SÄKER LÖSENORDSHASHNING MED SALT
function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

// VALIDERAR LÖSENORD MOT LAGRADE HASHVÄRDEN
function validatePassword(inputPassword: string, storedSalt: string, storedHash: string): boolean {
  const hash = crypto.pbkdf2Sync(inputPassword, storedSalt, 10000, 64, 'sha512').toString('hex')
  return storedHash === hash
}

// KONTROLLERAR LÖSENORDETS STYRKA
function validatePasswordStrength(password: string): string[] {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Lösenordet måste vara minst 8 tecken')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en stor bokstav')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en liten bokstav')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en siffra')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst ett specialtecken')
  }

  // VANLIGA LÖSENORD SOM SKA UNDVIKAS
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123']
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Detta lösenord är för vanligt och osäkert')
  }

  return errors
}

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData()
    const username = data.get('username')?.toString()
    const password = data.get('password')?.toString()

    if (!username || !password) {
      return fail(400, { error: 'Användarnamn och lösenord krävs' })
    }

    if (username.length < 3) {
      return fail(400, { error: 'Användarnamn måste vara minst 3 tecken' })
    }

    // KONTROLLERA LÖSENORDETS STYRKA
    const passwordErrors = validatePasswordStrength(password)
    if (passwordErrors.length > 0) {
      return fail(400, { error: passwordErrors.join('. ') })
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })

      if (existingUser) {
        return fail(400, { error: 'Användarnamnet är redan taget' })
      }

      // HASHAR LÖSENORDET MED SALT PÅ ETT SÄKERT SÄTT
      const { salt, hash } = hashPassword(password)

      const newUser = await prisma.user.create({
        data: {
          username,
          salt: salt,
          hash: hash
        }
      })

      cookies.set('userId', newUser.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: false,
        httpOnly: true
      })

    } catch (error) {
      console.error('Register error:', error)
      return fail(500, { error: 'Misslyckades att skapa konto' })
    }

    throw redirect(303, '/dashboard')
  },

  login: async ({ request, cookies }) => {
    const data = await request.formData()
    const username = data.get('username')?.toString()
    const password = data.get('password')?.toString()

    if (!username || !password) {
      return fail(400, { error: 'Alla fält måste fyllas i' })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { username }
      })

      // DUMMYDATA FÖR ATT SKYDDA MOT TIMINGATTACKER
      const dummySalt = 'dummysalt123456789abcdef123456789abcdef'
      const dummyHash = 'dummyhash123456789abcdef123456789abcdef123456789abcdef123456789abcdef'

      let isValidPassword = false

      if (user && user.hash && user.salt) {
        // NY ANVÄNDARE MED SÄKERT LÖSENORD
        isValidPassword = validatePassword(password, user.salt, user.hash)
      } else if (user && user.password && !user.hash) {
        // GAMMAL ANVÄNDARE MED KLARTEXTLÖSENORD – MIGRERAS VID LYCKAD INLOGGNING
        if (user.password === password) {
          // MIGRERA LÖSENORDET TILL SÄKERT FORMAT
          const { salt, hash } = hashPassword(password)
          await prisma.user.update({
            where: { id: user.id },
            data: {
              salt: salt,
              hash: hash,
              password: null
            }
          })
          isValidPassword = true
        }
      } else {
        // ICKE BEFINTLIG ANVÄNDARE – HASH KÖRS ÄNDÅ FÖR ATT UNDVIKA TIMINGSKILLNADER
        isValidPassword = validatePassword(password, dummySalt, dummyHash)
      }

      if (!user || !isValidPassword) {
        return fail(400, { error: 'Ogiltigt användarnamn eller lösenord' })
      }

      cookies.set('userId', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: false,
        httpOnly: true
      })

    } catch (error) {
      console.error('Login error:', error)
      return fail(500, { error: 'Inloggningen misslyckades' })
    }

    throw redirect(303, '/characters')
  },

  logout: async ({ cookies }) => {
    cookies.delete('userId', { path: '/' })
    throw redirect(303, '/')
  }
}
