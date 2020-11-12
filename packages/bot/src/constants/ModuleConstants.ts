export const MODULE_CONSTANTS: Record<string, string> = {
	logging:
		'The logging module allows you to setup channels where events of the server such as message editing or role creating can be logged.',
	info:
		'The info module provides info on all discord entities such as servers, users, and channels.',
};

export const MODULES = [...Object.keys(MODULE_CONSTANTS)];
