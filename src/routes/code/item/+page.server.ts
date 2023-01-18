import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const data = await request.formData();

		const items = db('items');

		try {
			const fields = {
				code: data.get('code'),
				description: data.get('description'),
				stored: data.get('stored'),
				household: locals?.token?.user?.household
			};

			const id = data.get('id');

			if (id?.length) {
				await items.update([
					{
						id: data.get('id'),
						fields
					}
				]);
			} else {
				await items.create([
					{
						fields
					}
				]);
			}
		} catch (e) {
			console.error(e);
			return fail(500, e.message);
		}
		throw redirect(303, `/code/item/${data.get('code')}`);
	}
};
