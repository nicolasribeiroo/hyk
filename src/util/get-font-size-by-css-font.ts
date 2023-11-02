const defaultHeight = 16;

export function getFontSizeByCSSFont(cssFont: string) {
	const sizeFamily = /[\d.]+(?:px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)/.exec(cssFont);

	if (!sizeFamily || sizeFamily.length !== 3) {
		return defaultHeight;
	}

	switch (sizeFamily[2]) {
		case 'px':
			return Number(sizeFamily[1]);
		case 'pt':
			return Number(sizeFamily[1]) / 0.75;
		case 'pc':
			return Number(sizeFamily[1]) * 16;
		case 'in':
			return Number(sizeFamily[1]) * 96;
		case 'cm':
			return (Number(sizeFamily[1]) * 96) / 2.54;
		case 'mm':
			return (Number(sizeFamily[1]) * 96) / 25.4;
		case '%':
			return (Number(sizeFamily[1]) * defaultHeight) / 100;
		case 'em':
			return Number(sizeFamily[1]) * defaultHeight;
		case 'ex':
			return (Number(sizeFamily[1]) * defaultHeight) / 2;
		case 'ch':
			return (Number(sizeFamily[1]) * defaultHeight) / 2;
		case 'rem':
			return Number(sizeFamily[1]) * defaultHeight;
		case 'q':
			return (Number(sizeFamily[1]) * 96) / 25.4 / 4;
		default:
			return defaultHeight;
	}
}
