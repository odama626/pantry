<script lang="ts">
	import type { UsersRecord } from '$lib/server/db.types';
	import type { RecordAuthResponse } from 'pocketbase';

	export let user: RecordAuthResponse<UsersRecord>;
</script>

<h2>Logged in as {user?.name}</h2>
<form method="post" action="?/logout">
	<button>Logout</button>
</form>
