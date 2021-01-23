import { ServiceKey, ServiceMetadata } from './types';

export const Service = (
	metadata?: Partial<ServiceMetadata>
): ClassDecorator => target => {
	const existingMetadata =
		Reflect.getMetadata(ServiceKey, target.prototype) || {};
	const newMetadata = Object.assign(
		{ type: 'singleton' },
		existingMetadata,
		metadata || {}
	);
	Reflect.defineMetadata(ServiceKey, newMetadata, target.prototype);
};
