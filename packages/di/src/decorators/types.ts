import { Token } from '../types';

export const InjectableKey = Symbol('@utilly/di:injectable');

export const InjectKey = Symbol('@utilly/di:inject');

export type InjectMetadata = Record<number, Token>;
