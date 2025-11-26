import type { LayoutServerLoad } from './$types';
import { getUser } from '$lib/auth.js';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const user = await getUser(cookies);
  
  return {
    user: user
  };
};