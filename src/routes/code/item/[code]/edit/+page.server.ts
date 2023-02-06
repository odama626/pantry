import { pb, prepareItemRecord } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const code = params.code;

	try {
		const item = await pb
			.collection('items')
			.getFirstListItem(`code="${code}"`, { expand: `tags` })
			.catch(() => {});

		const payload = await prepareItemRecord(item);

		return payload || { code };
	} catch (e) {
		console.error(e);
	}
}) satisfies PageServerLoad;
