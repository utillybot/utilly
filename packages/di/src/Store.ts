import { Token, Type } from './types';

export class Store extends Map<Token, any> {
	public resolve<T>(target: { new (...args: any[]): T }): T {
		const classInstance = this.get(target);
		if (classInstance) {
			return classInstance as T;
		}
		const tokens: Array<Type<any>> =
			Reflect.getMetadata('design:paramtypes', target) || [];

		const injections = tokens.map(token => this.resolve(token));

		const newClassInstance = new target(...injections);
		this.set(target, newClassInstance);

		return newClassInstance;
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public register(target: Object, token?: Token): void {
		this.set(token ?? target.constructor, target);
	}
}

export const GlobalStore = new Store();
