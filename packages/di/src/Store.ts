import {
	StoredValue,
	Token,
	Constructable,
	ConstructableMapped,
} from './types';
import {
	InjectKey,
	InjectMetadata,
	ServiceKey,
	ServiceMetadata,
} from './decorators/types';
import { InjectionToken } from './InjectionToken';

class Store {
	private _store: Map<Token, StoredValue> = new Map();

	constructor(public name?: string) {}

	/**
	 * Resolves a constructable object into it's constructed form
	 * @param target - the constructable object
	 */
	public resolve<T extends object>(target: Constructable<T>): T {
		const serviceMetadata: ServiceMetadata = Reflect.getMetadata(
			ServiceKey,
			target.prototype
		);

		if (!serviceMetadata || serviceMetadata.type == 'singleton') {
			const storedValue = this._store.get(target);
			if (storedValue) return storedValue.value as T;
		}

		return this._createInstance(target);
	}

	/**
	 * Gets an value from this store
	 * @param token - the token to get
	 */
	public get<T>(token: InjectionToken<T>): T;
	public get<T>(token: Token): T;
	public get<T>(token: Token): T {
		const storedValue = this._store.get(token);
		if (!storedValue)
			throw new Error('Corresponding value with token not found');

		return storedValue.value as T;
	}

	/**
	 * Registers an instance value to this store
	 * @param instance - the instance to store
	 * @param token - an optional token to identify this instance with. if none is provided, the constructor is used
	 */
	public registerInstance(instance: object, token?: Token): void {
		this._store.set(token ?? instance.constructor, {
			type: 'instance',
			value: instance,
		});
	}

	/**
	 * Registers any value to this store
	 * @param value - the value to store
	 * @param token - the token to identify this value with
	 */
	public registerValue(value: object | string, token: Token): void {
		this._store.set(token, {
			type: 'value',
			value,
		});
	}

	/**
	 * Registers a factory to this store
	 * @param factory - the factory function creating a value to store
	 * @param dependencies - a list of dependencies to pass into the factory
	 * @param token - the token to identify this value with
	 */
	public registerFactory<T extends object[], J extends ConstructableMapped<T>>(
		factory: (...args: T) => unknown,
		dependencies: J,
		token: Token
	): void {
		const params = dependencies.map(dependency =>
			this.resolve(dependency)
		) as T;

		this._store.set(token, {
			type: 'value',
			value: factory(...params),
		});
	}

	private _createInstance<T extends object>(target: Constructable<T>): T {
		const tokens: Array<Constructable<object>> =
			Reflect.getMetadata('design:paramtypes', target) || [];
		const injects: InjectMetadata =
			Reflect.getOwnMetadata(InjectKey, target.prototype) || [];

		const params = tokens.map((token, index) => {
			if (injects[index]) {
				const param = this.get(injects[index]);
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
		this.registerInstance(instance);

		return instance;
	}
}

export class LocalStore extends Store {}

export const GlobalStore = new Store('GlobalStore');
