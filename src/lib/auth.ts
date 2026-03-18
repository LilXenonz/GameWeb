import { redirect } from '@sveltejs/kit'
import prisma from '$lib/prisma.js'
import * as crypto from 'node:crypto'

export function generateSessionToken(): string {
  // 32 bytes = 256 bits entropy
  return crypto.randomBytes(32).toString('base64url');
}

export async function createSession(userId: string, userAgent?: string, ipAddress?: string, days = 14) {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  // Try to parse device name from user agent (very basic)
  let deviceName = 'Unknown Device';
  if (userAgent) {
    if (userAgent.includes('Windows')) deviceName = 'Windows PC';
    else if (userAgent.includes('Macintosh')) deviceName = 'Mac';
    else if (userAgent.includes('Linux')) deviceName = 'Linux PC';
    else if (userAgent.includes('Android')) deviceName = 'Android Device';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) deviceName = 'iOS Device';
  }

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      userAgent,
      ipAddress,
      deviceName,
      expiresAt
    }
  });

  return session;
}

export async function validateSession(token: string | undefined) {
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) {
    return null;
  }

  // Check expiration
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  // Update last used (optimization: only update if > 1 hour ago to save DB writes)
  // But for this guide we update every time or maybe less frequently. 
  // Let's update it.
  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
  if (session.lastUsed < oneHourAgo) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsed: new Date() }
    });
  }

  return session;
}

export async function invalidateSession(token: string) {
  await prisma.session.delete({ where: { token } }).catch(() => { });
}

export async function requireAuth(cookies: any) {
  const token = cookies.get('sessionToken');

  if (!token) {
    throw redirect(303, '/login');
  }

  const session = await validateSession(token);

  if (!session) {
    cookies.delete('sessionToken', { path: '/' });
    throw redirect(303, '/login');
  }

  return session.user;
}

export async function getUser(cookies: any) {
  const token = cookies.get('sessionToken');
  const session = await validateSession(token);
  return session ? session.user : null;
}