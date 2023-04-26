import ColorHash from 'color-hash';


const color = new ColorHash({
  saturation: [0.35],
  lightness: [0.35]
});

export default function hashFunction(text: string):string {
  return color.hex(text);
}