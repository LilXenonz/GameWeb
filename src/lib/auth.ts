import { redirect } from '@sveltejs/kit';
import prisma from './prisma.js';

export async function requireAuth(cookies: any) {
  const userId = cookies.get('userId');
  
  if (!userId) {
    throw redirect(307, '/login');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    cookies.delete('userId', { path: '/' });
    throw redirect(307, '/login');
  }
  
  return user;
}

export async function getUser(cookies: any) {
  const userId = cookies.get('userId');
  
  if (!userId) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  return user;
}