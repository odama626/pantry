<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  console.log({data})
</script>

<main class="container">
  <h2>Edit</h2>
  <form method='post' action='/code/item?/edit'>
  <input type='hidden' name='id' value={data.id} />
  <input type='hidden' name='code' value={data.fields.code} />
  <input name='description' value={data.fields.description ?? ''} />
  <input name='stored at'  type='date' value={data.fields['stored at']} />
  <button>Save</button>
</form>
</main>