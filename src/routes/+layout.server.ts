export const load = async ({ locals }) => {
	return {
		user: locals.user,
		token: locals.token
	};
};
