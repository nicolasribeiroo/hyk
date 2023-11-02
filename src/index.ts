export * from './draw-text-with-twemoji.js';

export * from './util/measure-text.js';

/**
 * The \@nicolasribeiroo/hyk version
 * that you are currently using.
 *
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = '[VI]{{inject}}[/VI]' as string;
