import type { ItemsResponse, TagsRecord } from './server/db.types';

export function getIcon(data: ItemsResponse<{ tags: TagsRecord[] }>) {
	return data?.expand?.tags?.find((tag) => tag.icon)?.icon ?? '/unknown-tag.svg';
}
