import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';

interface Item {}

export const load = (async ({ params, locals }) => {
	try {
		let items: Item[] = [];
		const { household } = locals?.token?.user ?? {};

		if (household) {
			items = await db('items')
				.select({ filterByFormula: `{household} = '${locals?.token?.user?.household}'` })
				.firstPage();
		}

		return {
			items: items.map((item) => item.fields)
		};
	} catch (e) {
		console.error(e);
	}
}) satisfies PageServerLoad;
