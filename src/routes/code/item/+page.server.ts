import { pb } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData.entries());

		try {
			const fields = {
				code: data.code === 'undefined' ? undefined : data.code,
				description: data.description,
				stored: data.stored,
				tags: [],
				household: locals?.token?.user?.record?.household
			};

			const id = data.id;

			console.log({ fields, id });

			if (id?.length) {
				await pb.collection('items').update(id, fields);
			} else {
				const result = await pb.collection('items').create(fields);
				console.log({ result });
			}
		} catch (e) {
			console.dir(e, { depth: 5 });
			return fail(500, e.message);
		}
		console.log('redirect', data.code)
		throw redirect(303, `/code/item/${data.code}`);
	}
};
