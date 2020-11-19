/**
 * Merge the provided css classes
 * @param classes - css classnames or an object mapping a classname to a boolean of whether it should be added
 */
const mergeCssClasses = (
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

const constructMediaQuery = (
	query:
		| ['min-width', [number, 'px' | 'em']]
		| ['max-width', [number, 'px' | 'em']]
): string => {
	return `(${query[0]}: ${query[1].join('')})`;
};

export const mc = mergeCssClasses;
export const cmq = constructMediaQuery;
