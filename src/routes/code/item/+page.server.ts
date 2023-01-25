import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData.entries());

		const items = db('items');

		try {
			const fields = {
				code: data.code,
				description: data.description,
				stored: data.stored,
				household: locals?.token?.user?.household
			};

			const id = data.id;

			if (id?.length) {
				await items.update([{ id: data.id, fields }]);
			} else {
				await items.create([{ fields }]);
			}
		} catch (e) {
			console.error(e);
			return fail(500, e.message);
		}
		throw redirect(303, `/code/item/${data.code}`);
	}
};
