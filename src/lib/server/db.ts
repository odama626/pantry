import Airtable from 'airtable';

export const airtable = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_KEY }).base(
	'appH7bTBuWOjf218I'
);