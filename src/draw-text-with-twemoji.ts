import type { SKRSContext2D } from '@napi-rs/canvas';
import { getFontSizeByCSSFont } from './util/get-font-size-by-css-font.js';
import { loadTwemojiImageByUrl } from './util/load-twemoji-image-by-url.js';
import { measureText } from './util/measure-text.js';
import { splitEntitiesFromText } from './util/split-entities-from-text.js';

interface IDrawTextWithTwemojiOptions {
	context: SKRSContext2D;
	fillType: 'fill' | 'stroke';
	options: {
		emojiSideMarginPercent?: number;
		emojiTopMarginPercent?: number;
	};
	text: string;
	x: number;
	y: number;
}

export async function drawTextWithTwemoji({
	context,
	fillType,
	text,
	x,
	y,
	options: { emojiSideMarginPercent = 0.1, emojiTopMarginPercent = 0.1 } = {},
}: IDrawTextWithTwemojiOptions) {
	const textEntities = splitEntitiesFromText(text);
	const fontSize = getFontSizeByCSSFont(context.font);
	const baseLine = context.measureText('');
	const textAlignment = context.textAlign;

	const emojiSideMargin = fontSize * emojiSideMarginPercent;
	const emojiTopMargin = fontSize * emojiTopMarginPercent;

	const textWidth = measureText(context, text, { emojiSideMarginPercent }).width;

	let textLeftMargin = 0;

	if (!['', 'left', 'start'].includes(textAlignment)) {
		context.textAlign = 'left';

		switch (textAlignment) {
			case 'center':
				textLeftMargin = -textWidth / 2;
				break;

			case 'right':
			case 'end':
				textLeftMargin = -textWidth;
				break;

			default:
				throw new Error(`Invalid text alignment: ${textAlignment}`);
		}
	}

	let currentWidth = 0;

	for (const entity of textEntities) {
		if (typeof entity === 'string') {
			if (fillType === 'fill') {
				context.fillText(entity, textLeftMargin + x + currentWidth, y);
			} else {
				context.strokeText(entity, textLeftMargin + x + currentWidth, y);
			}

			currentWidth += context.measureText(entity).width;
		} else {
			const emoji = await loadTwemojiImageByUrl(entity.url);

			context.drawImage(
				emoji,
				textLeftMargin + x + currentWidth + emojiSideMargin,
				y + emojiTopMargin - fontSize - baseLine.actualBoundingBoxDescent,
				fontSize,
				fontSize,
			);

			currentWidth += fontSize + emojiSideMargin * 2;
		}
	}

	if (textAlignment) {
		context.textAlign = textAlignment;
	}
}
