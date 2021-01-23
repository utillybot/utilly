import { InjectKey, InjectMetadata } from './types';
import { Token } from '../types';

export const Inject = (token: Token) => (
	target: Function,
	key: string | symbol,
	index: number
): void => {
	const existingInjections: InjectMetadata =
		Reflect.getOwnMetadata(InjectKey, target.prototype) || {};
	existingInjections[index] = token;
	Reflect.defineMetadata(InjectKey, existingInjections, target.prototype);
};
