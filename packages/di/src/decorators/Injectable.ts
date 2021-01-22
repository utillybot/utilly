import { InjectableToken } from '../types';

export const Injectable = (): ClassDecorator => target => {
	Reflect.defineMetadata(InjectableToken, true, target.constructor);
};
