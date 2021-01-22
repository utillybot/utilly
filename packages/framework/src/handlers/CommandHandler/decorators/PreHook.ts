import { CommandHook } from '../CommandHook';
import { PreHookMetadata, PreHookSymbol } from './types';

interface PreHookObject {
	preHooks: CommandHook[];
}

export function PreHook(preHook: CommandHook) {
	return <T extends PreHookObject, TFunction extends new (...args: any[]) => T>(
		target: TFunction
	): void => {
		let preHookMetadata: PreHookMetadata | undefined = Reflect.getMetadata(
			PreHookSymbol,
			target.prototype
		);

		if (!preHookMetadata) {
			preHookMetadata = [];
		}

		preHookMetadata.unshift(preHook);

		Reflect.defineMetadata(PreHookSymbol, preHookMetadata, target.prototype);
	};
}

export const loadPreHookMetadata = <T extends PreHookObject>(
	target: T
): void => {
	const preHookMetadata: PreHookMetadata | undefined = Reflect.getOwnMetadata(
		PreHookSymbol,
		Object.getPrototypeOf(target)
	);
	if (preHookMetadata) target.preHooks = preHookMetadata;
};
