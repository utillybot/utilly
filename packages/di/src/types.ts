import { InjectionToken } from './InjectionToken';

export interface Type<T extends object> {
	new (...args: any[]): T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Token = Type<any> | InjectionToken | string;
