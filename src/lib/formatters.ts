export function date(input: string): string {
	const [y, m, d] = input.split('-');
	return [m, d, y].join('/');
}
