import { OnSymbol } from './types';

export function On(event: string): MethodDecorator {
	return <T>(
		// eslint-disable-next-line @typescript-eslint/ban-types
		target: Object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<T>
	) => {
		Reflect.defineMetadata(OnSymbol, event, { target }, propertyKey);
	};
}
