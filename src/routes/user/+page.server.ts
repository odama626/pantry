import { db } from '$lib/server/db';
import { FieldError, requireFields } from '$lib/server/forms';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
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

function getUserByEmail(email?: string) {
	return db('users')
		.select({ maxRecords: 1, filterByFormula: `{email} = '${email}'` })
		.firstPage()
		.then((r) => r[0]);
}

interface User {
	email: string;
	household: string;
	name: string;
}

function createJwt(user: User) {
	const { email, name, household } = user;
	return jwt.sign(
		{
			data: { user: { email, name, household } }
		},
		import.meta.env.VITE_JWT_SECRET,
		{ expiresIn: `7h` }
	);
}

function handleLoginReturn(cookies) {
	const returnPath = cookies.get(import.meta.env.VITE_COOKIE_NAME + '_return') ?? '/code/items';
	if (returnPath) {
		cookies.delete(import.meta.env.VITE_COOKIE_NAME + '_return');
		throw redirect(303, returnPath);
	}
}

export const actions: Actions = {
	async login({ cookies, request }) {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		try {
			requireFields({ email, password });

			const user = await getUserByEmail(email);
			if (!(await bcrypt.compare(password, user.fields.password))) throw new Error('incorrect password');

			if (!user.fields.invited) {
				return fail(400, {
					error: {
						message: `You're registered but still need to wait for your invitation to be accepted`
					}
				});
			}

			cookies.set(import.meta.env.VITE_COOKIE_NAME, createJwt(user.fields));
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
		const email = data.get('email');
		const name = data.get('name');
		const password = data.get('password');
		const household = data.get('household');

		try {
			requireFields({ email, name, password, household });

			if (await getUserByEmail(email))
				throw new FieldError('email', 'This email is already in registered');

			const user = {
				name: escape(name),
				household: escape(household?.toString().toLowerCase()),
				email: escape(email),
				password: await bcrypt.hash(password, parseInt(import.meta.env.VITE_BCRYPT_SALT_ROUNDS))
			};

			await db('users').create([{ fields: user }]);
		} catch (error) {
			return fail(400, {
				fields: { email, name, household, type: 'register' },
				error: { field: error?.field, message: error.message }
			});
		}
	}
};
