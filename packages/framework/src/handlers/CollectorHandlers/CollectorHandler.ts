import { EventEmitter } from 'events';
import type { Hook } from '../Hook';
import { runHooks } from '../Hook';

export abstract class CollectorHandler<T extends Hook<J>, J> {
    private readonly _collectors: Array<Collector<T, J>>;

    protected constructor() {
        this._collectors = [];
    }

    createListener(hooks?: T[]): Collector<T, J> {
        const collector = new Collector<T, J>(hooks);
        this._collectors.push(collector);
        collector.on('destroy', () => {
            this._collectors.splice(this._collectors.indexOf(collector), 1);
        });
        return collector;
    }

    checkCollectors(ctx: J): void {
        for (const collector of this._collectors) collector.check(ctx);
    }
}

export interface Collector<T extends Hook<J>, J> {
    collected: J[];

    on(event: 'collect', listener: (ctx: J) => void): this;
    on(event: 'destroy', listener: () => void): this;
}

export class Collector<T extends Hook<J>, J> extends EventEmitter {
    private readonly _hooks?: T[];
    private _destroyed: boolean;

    constructor(hooks?: T[]) {
        super();
        this._hooks = hooks;
        this._destroyed = false;

        this.collected = [];
    }

    async check(ctx: J): Promise<void> {
        if (this._destroyed) return;
        if (this._hooks && !(await runHooks(ctx, this._hooks))) return;

        this.emit('collect', ctx);
        this.collected.push(ctx);
    }

    async collectNext(): Promise<J> {
        return new Promise((resolve, reject) => {
            this.on('collect', (ctx: J) => {
                resolve(ctx);
                this.destroy();
            });
            this.on('destroy', reject);
        });
    }

    destroy(): void {
        this.emit('destroy');
        this._destroyed = true;
        this.removeAllListeners();
    }
}
