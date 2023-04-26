import { pb } from '$lib/server/db';
import { TagsRecord } from '$lib/server/db.types.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const search = url.searchParams.get('search');
	const page = parseInt(url.searchParams.get('page') ?? '10');
	const pageSize = Math.max(Math.min(parseInt(url.searchParams.get('pagesize') ?? '20'), 100), 1);
	const result = await pb
		.collection('tags')
		.getList<TagsRecord>(page, pageSize, { filter: `name ~ '${search}'` });

	result.items.forEach((tag) => {
		tag.icon = pb.getFileUrl(tag, tag.icon);
	});

	return json(result);
}
