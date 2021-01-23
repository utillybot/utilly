import { Token, Type } from './types';
import { InjectKey, InjectMetadata } from './decorators/types';

class Store {
	private _store: Map<Token, unknown> = new Map();

	constructor(public name?: string) {}

	public resolve<T extends object>(target: Type<T>): T {
		const instance = this._store.get(target);
		if (instance) return instance as T;

		return this._createInstance(target);
	}

	public get<T>(token: Token): T {
		return this._store.get(token) as T;
	}

	public register(target: object | string, token?: Token): void {
		if (!target.constructor && !token)
			throw new Error(
				'Cannot register constructorless dependency without a token'
			);
		this._store.set(token ?? target.constructor, target);
	}

	private _createInstance<T extends object>(target: Type<T>): T {
		const tokens: Array<Type<object>> =
			Reflect.getMetadata('design:paramtypes', target) || [];
		const injects: InjectMetadata =
			Reflect.getOwnMetadata(InjectKey, target.prototype) || [];

		const params = tokens.map((token, index) => {
			if (injects[index]) {
				const param = this._store.get(injects[index]);
				if (!param)
					throw new Error(
						`The token ${injects[index]} was not registered to ${
							this.name ?? 'a store'
						}.`
					);
				return param;
			} else {
				return this.resolve(token);
			}
		});

		const instance = new target(...params);
		this._store.set(target, instance);

		return instance;
	}
}

export class LocalStore extends Store {}

export const GlobalStore = new Store('GlobalStore');
