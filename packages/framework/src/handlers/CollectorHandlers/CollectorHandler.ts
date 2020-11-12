import type { Hook } from '../Hook';
import { runHooks } from '../Hook';
import { EventListener } from '../../utils/EventListener';
import type { Handler } from '../Handler';

/**
 * An abstract handler for multiple collectors
 */
export abstract class CollectorHandler<T extends Hook<J>, J>
	implements Handler {
	private readonly _collectors: Array<Collector<T, J>> = [];

	addCollector(collector: Collector<T, J>): Collector<T, J> {
		this._collectors.push(collector);
		collector.on('end', () => {
			this._collectors.splice(this._collectors.indexOf(collector), 1);
		});
		return collector;
	}

	/**
	 * Creates a listener with the given hooks
	 * @param hooks - an array of hooks to register for this listener
	 */
	createListener(hooks?: T[]): Collector<T, J> {
		const collector = new Collector<T, J>(hooks);
		this._collectors.push(collector);
		collector.on('end', () => {
			this._collectors.splice(this._collectors.indexOf(collector), 1);
		});
		return collector;
	}

	/**
	 * Runs the check function on all of the collectors
	 * @param ctx - the command run the hooks with
	 */
	checkCollectors(ctx: J): void {
		for (const collector of this._collectors) collector.process(ctx);
	}

	abstract attach(): void;
}

export interface Collector<T extends Hook<J>, J> {
	/**
	 * Handles when an item is collected
	 * @event collect
	 */
	on(event: 'collect', listener: (ctx: J) => void): this;

	/**
	 * Handles when the collector starts collected
	 * @event start
	 */
	on(event: 'start', listener: () => void): this;

	/**
	 * Handles when the collector stops collecting
	 * @event end
	 */
	on(event: 'end', listener: (reason: string) => void): this;
}

/**
 * A collector for a bunch of objects
 */
export class Collector<T extends Hook<J>, J> extends EventListener {
	/**
	 * Whether or not this collector was started
	 */
	started = false;

	/**
	 * An array of collected items from this collector
	 */
	collected: J[] = [];

	private readonly _hooks?: T[];

	/**
	 * Creates a new collector with an array of hooks to run
	 * @param hooks - the array of hooks
	 * @param startStarted - whether or not to start this collector in the "started" state
	 */
	constructor(hooks?: T[], startStarted = true) {
		super();
		this._hooks = hooks;
		if (startStarted) this.start();
	}

	/**
	 * Checks if a given context is valid according to the hooks
	 * @param ctx - the context to check on
	 */
	async process(ctx: J): Promise<void> {
		if (!this.started) return;
		if (this._hooks && !(await runHooks(ctx, this._hooks))) return;

		this.emit('collect', ctx);
		this.collected.push(ctx);
	}

	/**
	 * Collect the next entity.
	 * Optionally specify a timeout to end if the timeout is reached.
	 * The resulting promise will resolve with the collected entity or reject if the listener was destroyed/ended.
	 *
	 * End reasons
	 * - collectNext:time
	 *   The timer completed before an entity was collected
	 * - collectNext:collect
	 *   An entity was collected
	 *
	 * @param timeout - the timeout to end this listener
	 * @return a promise resolving with the collected entity or rejecting with an end reason
	 */
	async collectNext(timeout?: number): Promise<J> {
		return new Promise((resolve, reject) => {
			let time: NodeJS.Timeout;

			if (timeout) {
				time = setTimeout(() => {
					this.end('collectNext:time');
					clearTimeout(time);
				}, timeout * 1000);
			}

			const disposeListeners = () => {
				this.removeListener('collect', collectListener);
				this.removeListener('end', endListener);
			};

			const collectListener = (ctx: J) => {
				disposeListeners();
				resolve(ctx);
				if (time) clearTimeout(time);
				this.end('collectNext:collect');
			};

			const endListener = (reason: string) => {
				disposeListeners();
				reject(reason);
			};

			this.on('collect', collectListener);
			this.on('end', endListener);
		});
	}

	/**
	 * Collect entities for a certain amount of time until the timeout is over
	 *
	 * End reasons
	 * - collectFor: done
	 *   Done collecting entities
	 *
	 * @param timeout - the amount of time to collect in seconds
	 * @return a list of entities collected
	 */
	async collectFor(timeout: number): Promise<J[]> {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve(this.collected);
				this.end('collectFor:done');
			}, timeout * 1000);
		});
	}

	start(): void {
		if (!this.started) {
			this.started = true;
			this.emit('start');
		}
	}

	end(reason: string): void {
		this.started = false;
		this.emit('end', reason);
		this.removeAllListeners();
	}
}
