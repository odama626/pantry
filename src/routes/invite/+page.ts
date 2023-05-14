import { pb } from "$lib/api"


export async function load({ params, route, url }) {

  const invite = await pb.collection('invites').getOne(url.searchParams.get('id',{ expand: 'invited_by,household'}))

  return { invite }
}