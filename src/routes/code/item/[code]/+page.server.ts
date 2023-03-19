import type { PageServerLoad } from './$types';

import { pb, prepareItemRecord } from '$lib/server/db';

export const load = (async ({ params }) => {
	const code = params.code;

	try {
		const item = await pb
			.collection('items')
			.getFirstListItem(`code="${code}"`, { expand: `tags` })
			.catch(() => {});

		const payload = item && (await prepareItemRecord(item));
		return payload || { code };
	} catch (e) {
		console.dir(e, { depth: 5 });
	}
}) satisfies PageServerLoad;
