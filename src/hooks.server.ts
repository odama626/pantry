import { db } from '$lib/server/db';
import { redirect, type Handle, type Actions } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const safeRoutes = ['/', '/user'];

export const handle = (async ({ event, resolve }) => {
	const rawJwt = event.cookies.get(import.meta.env.VITE_COOKIE_NAME);

	try {
		event.locals.token = jwt.verify(rawJwt, import.meta.env.VITE_JWT_SECRET)?.data;
	} catch (e) {
		if (!safeRoutes.includes(event.url.pathname)) {
			console.error('user not logged in');
			return new Response('Redirect', {
				status: 303,
				headers: {
					Location: `/user`,
					'Set-Cookie': event.cookies.serialize(
						import.meta.env.VITE_COOKIE_NAME + '_return',
						event.url.pathname
					)
				}
			});
		}
	}

	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
