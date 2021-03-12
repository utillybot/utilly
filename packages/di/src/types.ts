import { InjectionToken } from './InjectionToken';

/**
 * A type that has a constructor
 */
export interface Constructable<T> {
	new (...args: any[]): T;
}

/**
 * Map a bunch of instance objects to their constructors
 */
export type ConstructableMapped<T> = {
	[P in keyof T]: Constructable<T[P]>;
};

export type Token = Constructable<any> | InjectionToken<unknown>;

export interface StoredValue {
	type: 'instance' | 'value';
	value: unknown;
}
