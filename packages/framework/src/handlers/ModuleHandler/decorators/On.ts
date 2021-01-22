import { OnSymbol } from './types';

export function Event(): MethodDecorator {
	return (target, propertyKey, descriptor) => {
		Reflect.defineMetadata(
			OnSymbol,
			Reflect.getMetadata('design:paramtypes', target, propertyKey),
			{ target },
			propertyKey
		);
	};
}
