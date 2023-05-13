import { pb, exportRecord, getIcon } from '$lib/server/db'
import type { HouseholdsRecord, UsersResponse } from '$lib/server/db.types';


export async function load({ params, locals }) {
  const id = params.id;

  try {
    const rawHousehold = await pb.collection('households').getOne<HouseholdsRecord>(id, { expand: 'users' }).catch(() => { });
    const rawMembers = await pb.collection('users').getFullList<UsersResponse>({ filter: `households ~ '${rawHousehold.id}'` });

    if (!rawHousehold.image) {
      rawHousehold.image = await getIcon(rawHousehold.name);
      const formData = new FormData();
      formData.set('image', await fetch(rawHousehold.image).then(r => r.blob()));
      pb.collection('households').update(rawHousehold.id, formData);
      
    } else {
      rawHousehold.image = pb.getFileUrl(rawHousehold, rawHousehold.image);
    }

    const household = rawHousehold && (exportRecord(rawHousehold));
    const members = rawMembers && exportRecord(rawMembers);
    return { household, members };
  } catch (e) {
    console.dir(e, { depth: 3 });
  }
}
