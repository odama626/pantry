import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	return {
		user: locals?.token?.user
	};
}) satisfies PageServerLoad;
