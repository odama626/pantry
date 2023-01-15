import { airtable } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async ({ request }) => {
		const data = await request.formData();

		try {
			console.log({ code: data.get('code') });

			const fields = {
				code: data.get('code'),
				description: data.get('description'),
				'stored at': data.get('stored at')
			};

			const id = data.get('id');

			console.log({ id });

			if (id?.length) {
				await airtable('items').update([
					{
						id: data.get('id'),
						fields
					}
				]);
			} else {
				await airtable('items').create([
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
