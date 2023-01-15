import { airtable } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async ({ request }) => {
		const data = await request.formData();

		console.log({ code: data.get('code') });

		const fields = {
			code: data.get('code'),
			description: data.get('description'),
			'stored at': data.get('stored at')
		};

		if (data.get('id')?.length) {
			airtable('items').update([
				{
					id: data.get('id'),
					fields
				}
			]);
		} else {
			airtable('items').create([
				{
					fields
				}
			]);
		}

		throw redirect(303, `/code/item/${data.get('code')}`);

		return { success: true };
	}
};
