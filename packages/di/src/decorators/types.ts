import { Token } from '../types';

export const ServiceKey = Symbol('@utilly/di:service');
export interface ServiceMetadata {
	type: 'singleton' | 'transient';
	scope?: 'global';
}

export const InjectKey = Symbol('@utilly/di:inject');
export type InjectMetadata = Record<number, Token>;
