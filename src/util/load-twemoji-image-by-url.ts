import type { Image } from '@napi-rs/canvas';
import { loadImage } from '@napi-rs/canvas';

const cachedTwemojiImages = new Map();

export async function loadTwemojiImageByUrl(url: string): Promise<Image> {
	console.log(url);
	if (cachedTwemojiImages.has(url)) {
		return cachedTwemojiImages.get(url);
	}

	const image = await loadImage(url);
	if (!url.includes('discord')) {
		cachedTwemojiImages.set(url, image);
	}

	return image;
}
