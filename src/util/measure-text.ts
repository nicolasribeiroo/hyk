import type { SKRSContext2D } from '@napi-rs/canvas';
import { getFontSizeByCSSFont } from './get-font-size-by-css-font';
import { splitEntitiesFromText } from './split-entities-from-text';

export function measureText(context: SKRSContext2D, text: string, { emojiSideMarginPercent = 0.1 }) {
	const textEntities = splitEntitiesFromText(text);
	const fontSize = getFontSizeByCSSFont(context.font);

	const emojiSideMargin = fontSize * emojiSideMarginPercent;

	let currentWidth = 0;

	for (const entity of textEntities) {
		if (typeof entity === 'string') {
			currentWidth += context.measureText(entity).width;
		} else {
			currentWidth += fontSize + emojiSideMargin * 2;
		}
	}

	const measured = context.measureText('');

	return {
		width: currentWidth,
		height: measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent,
	};
}
