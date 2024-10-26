import { TinyColor } from "@ctrl/tinycolor";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateId(length: number): string {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const nanoid = customAlphabet(alphabet, length);
	return nanoid();
}

export function convertHexToRGBA(hexCode: string, opacity = 1) {
	let hex = hexCode.replace("#", "");

	if (hex.length === 3) {
		hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
	}

	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);

	/* Backward compatibility for whole number based opacity values. */
	if (opacity > 1 && opacity <= 100) {
		opacity = opacity / 100;
	}
	// `rgba(${r},${g},${b},${opacity})`
	const rgbString = `${r},${g},${b}`;

	const highlight = `linear-gradient(to right, rgba(${rgbString}, 0.3) 0%, rgba(${rgbString}, 0.4) 60%, rgba(${rgbString}, 0.4) 60%, rgba(${rgbString}, 0.6) 85%, rgba(${rgbString}, 0.8) 100%)`;
	return highlight;
}

export function LightenDarkenColor(color: string, percent: number) {
	let usePound = false;

	if (color[0] === "#") {
		color = color.slice(1);
		usePound = true;
	}

	const num = Number.parseInt(color, 16);

	let r = (num >> 16) + percent;

	if (r > 255) r = 255;
	else if (r < 0) r = 0;

	let b = ((num >> 8) & 0x00ff) + percent;

	if (b > 255) b = 255;
	else if (b < 0) b = 0;

	let g = (num & 0x0000ff) + percent;

	if (g > 255) g = 255;
	else if (g < 0) g = 0;

	return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}
// TODO: use the helper from tinycolor
export function lightOrDark(color: string) {
	const { r, g, b } = new TinyColor(color).toRgb();

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

	// Using the HSP value, determine whether the color is light or dark
	return hsp > 190 ? "light" : "dark";
}
export function convertHex(hexCode: string, opacity = 1) {
	const rgba = new TinyColor(hexCode);
	rgba.toRgbString();
	rgba.setAlpha(opacity);
	return rgba.toRgbString();
}
