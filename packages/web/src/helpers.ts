import type { CSSProperties } from 'react';

/**
 * Merge the provided css classes
 * @param classes - css classnames or an object mapping a classname to a boolean of whether it should be added
 */
const mergeCSSClasses = (
	...classes: Array<string | { [key: string]: boolean | undefined } | undefined>
): string => {
	let result = '';
	for (const cssClass of classes) {
		if (typeof cssClass === 'string') {
			result += cssClass + ' ';
		} else if (typeof cssClass === 'object') {
			for (const className in cssClass) {
				cssClass[className] && (result += className + ' ');
			}
		}
	}

	return result;
};

const mergeCSSStyles = (
	...styles: Array<CSSProperties | undefined>
): CSSProperties => {
	let props: CSSProperties = {};

	for (const style of styles) {
		if (!style) continue;
		props = Object.assign(props, style);
	}
	return props;
};

const constructMediaQuery = (
	query:
		| ['min-width', [number, 'px' | 'em']]
		| ['max-width', [number, 'px' | 'em']]
): string => {
	return `(${query[0]}: ${query[1].join('')})`;
};

export const getCookie = (cname: string): string | null => {
	const name = cname + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return null;
};

export const mc = mergeCSSClasses;
export const ms = mergeCSSStyles;
export const cmq = constructMediaQuery;
