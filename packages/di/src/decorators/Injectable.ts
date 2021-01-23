import { InjectableKey } from './types';

export const Injectable = (): ClassDecorator => target => {
	Reflect.defineMetadata(InjectableKey, true, target.prototype);
};
