import PocketBase from 'pocketbase';
import NounProject from 'the-noun-project';

export const pb = new PocketBase(import.meta.env.VITE_PB_DOMAIN);

const nounProject = new NounProject({
	key: import.meta.env.VITE_NOUN_KEY,
	secret: import.meta.env.VITE_NOUN_SECRET
});

function getIcon(term: string) {
	return new Promise((resolve, reject) =>
		nounProject.getIconsByTerm(term, { limit: 50 }, (err, data) => {
			if (err) return reject(err);
			resolve(
				data?.icons.find((icon) => icon.icon_url)?.icon_url ??
					data?.icons.find((icon) => icon?.preview_url)?.preview_url
			);
		})
	);
}

export async function generateTags(name: string) {
	const words = name.toLowerCase().split(' ');
	const tags = words
		.reduceRight(
			(result, next) => {
				const accum = `${next} ${result.accum}`.trim();
				result.tags.push(accum);
				result.accum = accum;
				return result;
			},
			{ tags: [], accum: '' }
		)
		.tags.filter(Boolean);

	const existing = await pb
		.collection('tags')
		.getList(0, tags.length, {
			filter: tags.map((tag) => `name="${tag}"`).join(' || '),
			sort: '-created'
		})
		.then((result) => Object.fromEntries(result.items.map((item) => [item.name, item])));

	console.dir({ existing }, { depth: 5 });

	const results = await Promise.all(
		tags.map(async (tag) => {
			if (existing[tag]) return existing[tag];
			const iconUrl = await getIcon(tag).catch(console.error);
			if (!iconUrl) return;
			// console.log({ icon });

			const iconFile = await fetch(iconUrl).then((r) => r.blob());

			const formData = new FormData();
			formData.set('name', tag);
			formData.set('icon', iconFile);
			return await pb.collection('tags').create(formData, { $autoCancel: false });
		})
	);

	return results.filter(Boolean);
}

export async function prepareItemRecord(item: Record<string, any>) {
	if (item && !item?.tags?.length) {
		const tags = await generateTags(item.description);
		item = await pb
			.collection('items')
			.update(item.id, { tags: tags.map((tag) => tag.id) }, { expand: `tags` });
	}

	const payload = item?.export();
	payload.expand.tags = item?.expand?.tags
		?.map((tag) => {
			return {
				...tag.export(),
				icon: pb.getFileUrl(tag, tag.icon)
			};
		})
		.sort((a, b) => b.name.length - a.name.length);

	return payload;
}


export function exportRecord(record, map = {}, field?: string) {
	if (Array.isArray(record)) return record.map((value) => exportRecord(value, map, field));
	let result = record.export();
	if (field && map[field]) result = map[field](result);

	Object.entries(result.expand).forEach(([field, value]) => {
		result.expand[field] = exportRecord(value, map, field);
	});

	return result;
}
