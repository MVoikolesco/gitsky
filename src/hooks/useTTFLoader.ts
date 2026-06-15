import type { Vec2 } from "manifold-3d";
import * as opentype from "opentype.js";
import { pointsOnPath } from "points-on-path";
import { peek, preload, suspend } from "suspend-react";

const FONT_CACHE = new Map<string, opentype.Font>();

const getPlainGlyphPaths = (
	font: opentype.Font,
	text: string,
	fontSize: number,
) => {
	const scale = fontSize / font.unitsPerEm;
	let x = 0;

	return Array.from(text).map((char) => {
		const glyph = font.charToGlyph(char);
		const path = glyph.getPath(x, fontSize, fontSize);
		x += (glyph.advanceWidth ?? font.unitsPerEm * 0.5) * scale;
		return path;
	});
};

export const toPolygons = (
	font: opentype.Font,
	text: string,
	fontSize: number = 1,
) => {
	const paths = getPlainGlyphPaths(font, text, fontSize);
	const svgs = paths.map((path) => path.toPathData(5));
	return svgs.flatMap((s) => {
		const result = pointsOnPath(s, 0.0001, 0.0001);
		return result.map((point) => point.map((p) => [p[0], p[1]] as Vec2));
	});
};

const loader = async (url: string) => {
	const cachedFont = FONT_CACHE.get(url);
	if (cachedFont !== undefined) {
		return cachedFont;
	}
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	const font = opentype.parse(buffer);
	FONT_CACHE.set(url, font);
	return font;
};

export function useTTFLoader(url: string) {
	return suspend(loader, [url]);
}

export async function loadTTF(url: string) {
	preload(loader, [url]);

	const cachedFont = peek([url]) as opentype.Font | undefined;
	if (cachedFont !== undefined) {
		return cachedFont;
	}

	return new Promise<opentype.Font>((resolve, reject) => {
		const timeoutMs = 10000;
		const startedAt = performance.now();
		const interval = window.setInterval(() => {
			const font = peek([url]) as opentype.Font | undefined;
			if (font !== undefined) {
				window.clearInterval(interval);
				resolve(font);
				return;
			}

			if (performance.now() - startedAt > timeoutMs) {
				window.clearInterval(interval);
				reject(new Error(`Timed out loading font: ${url}`));
			}
		}, 16);
	});
}

useTTFLoader.preload = (url: string) => preload(loader, [url]);
