export interface Type<T> {
	new (...args: any[]): T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Token = string | Type<any> | Function;

export const InjectableToken = Symbol('@utilly/di:injectable');
