import { EventEmitter } from 'events';
import type { Hook } from '../Hook';
import { runHooks } from '../Hook';

/**
 * An abstract handler for multiple collectors
 */
export abstract class CollectorHandler<T extends Hook<J>, J> {
    private readonly _collectors: Array<Collector<T, J>>;

    /**
     * Creates this collector handler
     * @protected
     */
    protected constructor() {
        this._collectors = [];
    }

    /**
     * Creates a listener with the given hooks
     * @param hooks - an array of hooks to register for this listener
     */
    createListener(hooks?: T[]): Collector<T, J> {
        const collector = new Collector<T, J>(hooks);
        this._collectors.push(collector);
        collector.on('destroy', () => {
            this._collectors.splice(this._collectors.indexOf(collector), 1);
        });
        return collector;
    }

    /**
     * Runs the check function on all of the collectors
     * @param ctx - the command run the hooks with
     */
    checkCollectors(ctx: J): void {
        for (const collector of this._collectors) collector.check(ctx);
    }
}

export interface Collector<T extends Hook<J>, J> {
    /**
     * An array of collected items from this collector
     */
    collected: J[];

    /**
     * Handles when an item is collected
     * @event collect
     */
    on(event: 'collect', listener: (ctx: J) => void): this;

    /**
     * Handles when this collector is destroy
     * @event collect
     */
    on(event: 'destroy', listener: () => void): this;
}

/**
 * A collector for a bunch of objects
 */
export class Collector<T extends Hook<J>, J> extends EventEmitter {
    private readonly _hooks?: T[];
    private _destroyed: boolean;

    /**
     * Creates a new collector with an array of hooks to run
     * @param hooks - the array of hooks
     */
    constructor(hooks?: T[]) {
        super();
        this._hooks = hooks;
        this._destroyed = false;

        this.collected = [];
    }

    /**
     * Checks if a given context is valid according to the hooks
     * @param ctx - the context to check on
     */
    async check(ctx: J): Promise<void> {
        if (this._destroyed) return;
        if (this._hooks && !(await runHooks(ctx, this._hooks))) return;

        this.emit('collect', ctx);
        this.collected.push(ctx);
    }

    /**
     * A promise wrapper to collect the next item.
     * The returned promise will resolve with the collected context and immediately destroy itself
     * If it was destroyed before something was collected, it'll reject
     */
    async collectNext(): Promise<J> {
        return new Promise((resolve, reject) => {
            this.on('collect', (ctx: J) => {
                resolve(ctx);
                this.destroy();
            });
            this.on('destroy', reject);
        });
    }

    /**
     * Destroys this collector and makes it unavailable for further use
     */
    destroy(): void {
        this.emit('destroy');
        this._destroyed = true;
        this.removeAllListeners();
    }
}
