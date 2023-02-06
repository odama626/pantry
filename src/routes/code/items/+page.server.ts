import type { PageServerLoad } from './$types';

import { pb, prepareItemRecord } from '$lib/server/db';

export const load = (async ({ params, locals }) => {
	try {
		let result = [];
		const { household } = locals?.token?.user?.record ?? {};

		if (household) {
			result = await pb.collection('items').getList(1, 500, {
				sort: `-created`,
				expand: 'tags'
			});
		}

		return {
			items: await Promise.all(result.items.map(prepareItemRecord))
		};
	} catch (e) {
		console.dir(e, { depth: 5 });
	}
}) satisfies PageServerLoad;
