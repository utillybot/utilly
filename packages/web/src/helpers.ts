/**
 * Merge the provided css classes
 * @param classes - css classnames or an object mapping a classname to a boolean of whether it should be added
 */
export const mc = (
	...classes: Array<string | { [key: string]: boolean } | undefined>
): string => {
	const result = [];
	for (const cssClass of classes) {
		if (typeof cssClass === 'string') {
			result.push(cssClass);
		} else if (typeof cssClass === 'object') {
			for (const [className, toggled] of Object.entries(cssClass)) {
				if (toggled) result.push(className);
			}
		}
	}

	return result.join(' ');
};
