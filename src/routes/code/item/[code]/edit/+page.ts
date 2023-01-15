import { error, json } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import Airtable from 'airtable';

const airtable = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_KEY }).base(
	'appH7bTBuWOjf218I'
);

export const load = (async ({ params }) => {
	const code = params.code;

	try {
		const item = await airtable('items')
			.select({
				maxRecords: 1,
				filterByFormula: `{code} = '${code}'`
			})
			.firstPage()
			.then((r) => r[0]);

		console.log(item);

		return item?._rawJson || { fields: { code } };
	} catch (e) {
		console.error(e);
	}
}) satisfies PageLoad;
