import { pb } from '$lib/server/db';
import type { HouseholdsResponse, UsersRecord, UsersResponse } from '$lib/server/db.types';
import { throwZodStylePbError, zodForm } from '$lib/server/forms';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { escape, omit } from 'lodash-es';
import type { RecordAuthResponse } from 'pocketbase';
import { z } from 'zod';
import type { Actions } from './$types';

export const load = async ({ params, cookies, locals }) => {
	const state = {
		authenticated: false,
		user: locals.user
	};

	try {
		jwt.verify(cookies.get(import.meta.env.VITE_COOKIE_NAME), import.meta.env.VITE_JWT_SECRET);
		state.authenticated = true;
	} catch (e) {
		console.error(e);
	}

	return state;
};

function createJwt(user: RecordAuthResponse<UsersRecord>) {
	return jwt.sign(
		{
			data: { user }
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

async function setCookie(
	cookies: Cookies,
	data: { email: string; password: string }
): Promise<UsersResponse> {
	const user = await pb
		.collection('users')
		.authWithPassword<UsersResponse>(data.email, data.password)
		.catch(throwZodStylePbError);

	if (!user) throw { errors: [{ path: 'email', message: 'Failed to log in' }] };

	cookies.set(import.meta.env.VITE_COOKIE_NAME, createJwt(user), {
		path: '/',
		secure: !import.meta.hot
	});

	return user.record;
}

export const actions: Actions = {
	async login({ cookies, request }) {
		const { raw, success, data, error } = zodForm(await request.formData(), {
			email: z.string().toLowerCase().trim().transform(escape),
			password: z.string().transform(escape)
		});

		try {
			if (error) throw { errors: error.errors };

			await setCookie(cookies, data);
		} catch (error) {
			return fail(400, {
				fields: { email: raw.email, type: 'login' },
				error
			});
		}
		return handleLoginReturn(cookies);
	},

	async logout({ cookies }) {
		cookies.delete(import.meta.env.VITE_COOKIE_NAME);
	},

	async register({ cookies, request }) {
		const { raw, data, error } = zodForm(await request.formData(), {
			email: z.string().email().toLowerCase().trim().transform(escape),
			name: z.string().trim().min(1, { message: 'Name must contain at least 1 character' }),
			password: z.string().min(12, { message: 'password must be at least 12 characters long' }),
			household: z.string().trim().transform(escape)
		});

		try {
			if (error) throw { errors: error.errors };

			await pb
				.collection('users')
				.create<UsersResponse>({
					...omit(data, 'household'),
					passwordConfirm: data.password,
					emailVisibility: true
				})
				.catch(throwZodStylePbError);

			const user = await setCookie(cookies, data);

			const household = await pb
				.collection('households')
				.create<HouseholdsResponse>({ name: data.household, admins: [user.id] })
				.catch(throwZodStylePbError);

			await pb
				.collection('users')
				.update(user.id, { defaultHousehold: household.id, households: [household.id] })
				.catch(throwZodStylePbError);

			await pb.collection('users').requestVerification(data.email);
		} catch (error) {
			console.dir(error, { depth: 3 });
			return fail(400, {
				fields: { ...omit(raw, 'password'), type: 'register' },
				error
			});
		}
		return handleLoginReturn(cookies);
	}
};
