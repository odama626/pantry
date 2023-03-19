import { pb } from '$lib/server/db';
import { requireFields } from '$lib/server/forms';
import { fail, redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { escape } from 'lodash-es';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, cookies }) => {
	const state = {
		authenticated: false,
		token: null
	};

	try {
		const token = jwt.verify(
			cookies.get(import.meta.env.VITE_COOKIE_NAME),
			import.meta.env.VITE_JWT_SECRET
		);
		state.user = token.data.user;
		state.authenticated = true;
	} catch (e) {
		console.error(e);
	}

	return state;
}) satisfies PageServerLoad;

interface User {
	email: string;
	household: string;
	name: string;
}

function createJwt(user: User) {
	const { password, ...rest } = user;
	return jwt.sign(
		{
			data: { user: rest }
		},
		import.meta.env.VITE_JWT_SECRET,
		{ expiresIn: `7h` }
	);
}

function handleLoginReturn(cookies) {
	let returnPath;
	try {
		returnPath = cookies.get(import.meta.env.VITE_COOKIE_NAME + '_return') ?? '/code/items';
		cookies.delete(import.meta.env.VITE_COOKIE_NAME + '_return');
	} catch (e) {
		//
	}
	throw redirect(303, returnPath);
}

export const actions: Actions = {
	async login({ cookies, request }) {
		const data = await request.formData();
		const email = escape(data.get('email') as string)?.toLowerCase?.();
		const password = data.get('password');

		try {
			requireFields({ email, password });

			const user = await pb.collection('users').authWithPassword(email, password);

			if (!user.record.invited) {
				return fail(400, {
					error: {
						message: `You're registered but still need to wait for your invitation to be accepted`
					}
				});
			}

			cookies.set(import.meta.env.VITE_COOKIE_NAME, createJwt(user), {
				path: '/',
				secure: !import.meta.hot
			});
		} catch (error) {
			console.error(error);
			return fail(400, {
				fields: { email, type: 'login' },
				error: { field: 'email', message: `email and password don't match` }
			});
		}
		return handleLoginReturn(cookies);
	},
	async logout({ cookies }) {
		cookies.delete(import.meta.env.VITE_COOKIE_NAME);
	},
	async register({ cookies, request }) {
		const data = await request.formData();
		const email = escape(data.get('email') as string).toLowerCase();
		const name = escape(data.get('name') as string);
		const password = data.get('password');
		const householdName = escape(data.get('household')).toLowerCase();

		try {
			requireFields({ email, name, password, householdName });

			// we shouldn't just add people to households, people could have the same last name
			let household = await pb
				.collection('households')
				.getFirstListItem(`name="${householdName}"`)
				.catch(() => {});

			if (!household) household = await pb.collection('households').create({ name: householdName });

			const user = {
				name,
				household: household?.id,
				email,
				password,
				passwordConfirm: password,
				emailVisibility: true
			};

			// await db('users').create([{ fields: user }]);
			const createdUser = await pb.collection('users').create(user);

			await pb.collection('users').requestVerification(user.email);
		} catch (error) {
			console.dir(error, { depth: 3 });
			return fail(400, {
				fields: { email, name, household: householdName, type: 'register' },
				error: { field: error?.field, message: error.message }
			});
		}
	}
};
