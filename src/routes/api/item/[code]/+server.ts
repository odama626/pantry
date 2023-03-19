import { pb } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const withErrorHandler = (callback) => async (params) => {
	try {
		return await callback(params);
	} catch (e) {
		console.log(e);
    throw error(e.code ?? 500, e)
	}
};

export const DELETE = withErrorHandler(async ({ params }) => {
	const { code } = params;

	const item = await pb.collection('items').getFirstListItem(`code="${code}"`);

	if (item) {
		const result = await pb.collection('items').delete(item.id);
		return json({ item, result });
	}
}) satisfies RequestHandler;
