import type { PageServerLoad } from './$types';
import { getUser } from '$lib/auth';

export const load: PageServerLoad = async ({ cookies, request }) => {
    const user = await getUser(cookies);

    // Debug: Check what cookies exist
    const sessionToken = cookies.get('sessionToken');

    // Get all cookie headers
    const cookieHeader = request.headers.get('cookie');

    console.log('=== DEBUG INFO ===');
    console.log('Session token exists:', !!sessionToken);
    console.log('Session token value:', sessionToken ? sessionToken.substring(0, 10) + '...' : 'none');
    console.log('User found:', !!user);
    console.log('User details:', user ? { id: user.id, username: user.username } : 'none');
    console.log('Cookie header:', cookieHeader);
    console.log('==================');

    return {
        user,
        sessionToken: !!sessionToken,
        hasUser: !!user,
        cookieHeader: cookieHeader || 'No cookies in request'
    };
};
