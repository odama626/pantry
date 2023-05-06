import { generateTags, pb } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData.entries());

		try {
			const tags = await generateTags(data.name, JSON.parse(data.tags));

			const fields = {
				code: data.code === 'undefined' ? undefined : data.code,
				name: data.name,
				description: data.description,
				stored: data.stored,
				tags: tags.map((tag) => tag.id),
				household: locals.user?.defaultHousehold
			};

			const id = data.id;

			if (id?.length) {
				await pb.collection('items').update(id, fields);
			} else {
				await pb.collection('items').create(fields);
			}
		} catch (e) {
			console.dir(e, { depth: 5 });
			return fail(500, e.message);
		}
		throw redirect(303, `/code/item/${data.code}`);
	}
};
