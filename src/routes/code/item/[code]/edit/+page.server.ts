import { db } from '$lib/server/db';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const code = params.code;

	try {
		const item = await db('items')
			.select({
				maxRecords: 1,
				filterByFormula: `{code} = '${code}'`
			})
			.firstPage()
			.then((r) => r[0]);

		return item?._rawJson || { fields: { code } };
	} catch (e) {
		console.error(e);
	}
}) satisfies PageLoad;
