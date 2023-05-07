import { pb, exportRecord } from '$lib/server/db'


export async function load({ params, locals }) {
  const id = params.id;

  try {
    const rawHousehold = await pb.collection('households').getOne(id, { expand: 'users(households.id)'}).catch(() => {});

    const household = rawHousehold && (await exportRecord(rawHousehold));
    return { household };
  } catch(e) {
    console.dir(e, { depth: 3});
  }
}
