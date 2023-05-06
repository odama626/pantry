import PocketBase, { BaseModel, ListResult } from 'pocketbase';
import NounProject from 'the-noun-project';
import type { TagsRecord } from './db.types';

export const pb = new PocketBase(import.meta.env.VITE_PB_DOMAIN);

const nounProject = new NounProject({
	key: import.meta.env.VITE_NOUN_KEY,
	secret: import.meta.env.VITE_NOUN_SECRET
});

function getIcon(term: string): Promise<string> {
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

export async function generateTags(name: string, additionalTags: TagsRecord[] = []) {
	const words = name.toLowerCase().split(' ');
	const automaticTags = words
		.reduceRight<{ tags: string[]; accum: string }>(
			(result, next) => {
				const accum = `${next} ${result.accum}`.trim();
				result.tags.push(accum);
				result.accum = accum;
				return result;
			},
			{ tags: [], accum: '' }
		)
		.tags.filter(Boolean);

	const manualTags = additionalTags.map((tag) => tag.name);

	const existing = await pb
		.collection('tags')
		.getList(0, automaticTags.length + manualTags.length, {
			filter: [...automaticTags, ...manualTags].map((tag) => `name="${tag}"`).join(' || '),
			sort: '-created'
		})
		.then((result) => Object.fromEntries(result.items.map((item) => [item.name, item])));

	const results = await Promise.all([
		...automaticTags.map(async (tag) => {
			if (existing[tag]) return existing[tag];
			const iconUrl = await getIcon(tag).catch(console.error);
			if (!iconUrl) return;

			const iconFile = await fetch(iconUrl).then((r) => r.blob());

			const formData = new FormData();
			formData.set('name', tag.trim());
			formData.set('icon', iconFile);
			formData.set('custom', false);
			return await pb.collection('tags').create(formData, { $autoCancel: false });
		}),
		...additionalTags.map(async (tag) => {
			if (!tag.name) return;
			if (existing[tag.name]) return existing[tag.name];

			const iconUrl = await getIcon(tag.name).catch(console.error);

			const iconFile = iconUrl && (await fetch(iconUrl).then((r) => r.blob()));

			const formData = new FormData();
			formData.set('name', tag.name.trim());
			iconFile && formData.set('icon', iconFile);
			formData.set('custom', true);
			return await pb.collection('tags').create(formData, { $autoCancel: false });
		})
	]);

	return results.filter(Boolean);
}

export async function prepareItemRecord(item: Record<string, any>) {
	const payload = item?.export();
	payload.expand.tags = item?.expand?.tags
		?.map((tag) => {
			return {
				...tag.export(),
				icon: tag.icon ? pb.getFileUrl(tag, tag.icon) : '/unknown-tag.svg'
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

export function exportListResult<T = BaseModel>(listResult: ListResult<T>) {
	return {
		...listResult,
		items: listResult.items.map<T>(item => exportRecord(item))
	};
}
