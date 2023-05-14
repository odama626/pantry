import { pb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const safeRoutes = ['/', '/user'];

export const handle = (async ({ event, resolve }) => {
	const rawJwt = event.cookies.get(import.meta.env.VITE_COOKIE_NAME);

	try {
		const token = jwt.verify(rawJwt, import.meta.env.VITE_JWT_SECRET)?.data;
		pb.authStore.save(token?.user?.token, token?.user?.record);

		event.locals.user = token?.user?.record;
		event.locals.token = token?.user?.token;

		if (!pb.authStore.isValid) throw new Error('Unathenticated');
	} catch (e) {
		console.error(e);
		if (!safeRoutes.includes(event.url.pathname)) {
			console.error('user not logged in');
			return new Response('Redirect', {
				status: 303,
				headers: {
					Location: `/user`,
					'Set-Cookie': event.cookies.serialize(
						import.meta.env.VITE_COOKIE_NAME + '_return',
						event.url.pathname,
						{ path: '/', httpOnly: true }
					)
				}
			});
		}
	}

	// if (event.url.pathname.startsWith('/custom')) {
	// 	return new Response('custom response');
	// }

	const response = await resolve(event);
	return response;
}) satisfies Handle;
