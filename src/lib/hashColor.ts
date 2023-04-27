import ColorHash from 'color-hash/dist/bundle';

export default function hashFunction(text: string): string {
	const color = new ColorHash({
		saturation: [0.35],
		lightness: [0.35],
		hash: 'bkdr'
	});
	return color.hex(text);
}
