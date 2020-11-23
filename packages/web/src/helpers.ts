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

export const getCookie = (cookieKey: string): string | undefined => {
	const cookieName = `${cookieKey}=`;

	const cookieArray = document.cookie.split(';');

	for (let cookie of cookieArray) {
		while (cookie.charAt(0) == ' ') {
			cookie = cookie.substring(1, cookie.length);
		}

		if (cookie.indexOf(cookieName) == 0) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}
};

export const deleteCookie = (cookieKey: string): void => {
	document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0; path=/;`;
};

export const mc = mergeCSSClasses;
export const ms = mergeCSSStyles;
export const cmq = constructMediaQuery;
