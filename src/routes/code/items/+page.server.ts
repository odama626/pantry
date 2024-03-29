import { pb, prepareItemRecord } from '$lib/server/db';
import type { ItemsResponse } from '$lib/server/db.types';
import type { ListResult } from 'pocketbase';

export const load = async ({ params, locals }) => {
	try {
		let result: ListResult<ItemsResponse> = {
			page: 0,
			perPage: 0,
			totalItems: 0,
			totalPages: 0,
			items: []
		};

		const { defaultHousehold } = locals.user ?? {};

		if (defaultHousehold) {
			result = await pb.collection('items').getList<ItemsResponse>(1, 500, {
				filter: `household='${defaultHousehold}'`,
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
};
