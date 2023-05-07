import { exportListResult, pb } from '$lib/server/db';
import type { HouseholdsResponse } from '$lib/server/db.types';

export async function load() {
	const households = await pb
		.collection('households')
		.getList<HouseholdsResponse>(0, 20, { expand: 'users(defaultHousehold)' });

	console.dir({ households }, { depth: 5});

	return exportListResult(households);
}
