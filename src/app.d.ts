// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { UsersResponse } from '$lib/server/db.types';

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UsersResponse;
		}
		interface PageData {
			user: UsersResponse;
		}
		// interface Platform {}
	}
}

export {};
