import type { PageLoad } from './$types';

import { db } from '$lib/server/db';

export const load = (async ({ params, locals }) => {
	const code = params.code;

	try {
		const item = await db('items')
			.select({
				maxRecords: 1,
				filterByFormula: `AND({code} = '${code}', {household} = '${locals?.token?.user?.household}')`
			})
			.firstPage()
			.then((r) => r[0]);

		return item?._rawJson || { fields: { code } };
	} catch (e) {
		console.error(e);
	}
}) satisfies PageLoad;
