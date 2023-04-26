import ColorHash from 'color-hash';

export default function hashFunction(text: string): string {
	const color = new ColorHash({
		saturation: [0.35],
		lightness: [0.35]
	});
	return color.hex(text);
}
