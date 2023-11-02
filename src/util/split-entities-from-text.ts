import type { EmojiEntity } from 'twemoji-parser';
import { parse } from 'twemoji-parser';
import { DISCORD_CDN_URL, DISCORD_EMOJI_REGEX } from './contants';

type ParsedEmoji = EmojiEntity | string;

function parseDiscordEmojis(textEntities: ParsedEmoji[]) {
	const newTextEntities: ParsedEmoji[] = [];

	for (const entity of textEntities) {
		if (typeof entity === 'string')
			for (const word of entity.replaceAll(new RegExp(DISCORD_EMOJI_REGEX, 'g'), '\u200B$&\u200B').split('\u200B')) {
				const match = new RegExp(DISCORD_EMOJI_REGEX).exec(word);
				newTextEntities.push(match ? ({ url: `${DISCORD_CDN_URL}/emojis/${match[1]}.png` } as EmojiEntity) : word);
			}
		else newTextEntities.push(entity);
	}

	return newTextEntities;
}

export function splitEntitiesFromText(text: string) {
	const twemojiEntities = parse(text, { assetType: 'png' });

	const textEntities: ParsedEmoji[] = [];
	let unparsedText = text;
	let lastTwemojiIndice = 0;

	for (const entity of twemojiEntities) {
		textEntities.push(unparsedText.slice(0, entity.indices[0] - lastTwemojiIndice));

		textEntities.push(entity);

		unparsedText = unparsedText.slice(entity.indices[1] - lastTwemojiIndice);
		lastTwemojiIndice = entity.indices[1];
	}

	textEntities.push(unparsedText);

	return parseDiscordEmojis(textEntities);
}
