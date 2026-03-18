import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getUser } from '$lib/auth';

export const load: PageServerLoad = async ({ cookies }) => {
    const user = await getUser(cookies);

    // If user is already logged in, redirect to dashboard
    if (user) {
        throw redirect(302, '/dashboard');
    }

    return {};
};
