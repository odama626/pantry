import { capitalize } from 'lodash-es';

export function date(input: string): string {
	const [y, m, d] = input.split('-');
	return [m, d, y].join('/');
}

export function titleCase(input: string): string {
	return input
		.split(' ')
		.map((word) => capitalize(word))
		.join(' ');
}
