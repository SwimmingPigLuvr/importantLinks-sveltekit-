import type { PageLoad } from '../../$types';
import { fetchUserData } from '$lib/fetchData';

export const load = (async ({ params }) => {
    console.log('Params:', params); // Logging the params
  const { username } = params;
  try {
    const data = await fetchUserData(username);
    console.log('Fetched data:', data); // Logging the fetched data
    return data;
  } catch (error) {
    console.error('An error occurred:', error); // Logging any errors
    throw error; // Re-throwing the error so that it gets handled appropriately
  }
}) satisfies PageLoad;