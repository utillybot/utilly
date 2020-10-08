import { EventEmitter } from 'events';

export class EventListener extends EventEmitter {
    async getNext(event: string): Promise<unknown> {
        return new Promise(resolve => {
            const listener = (...args: string[]) => {
                resolve(args);
                this.removeListener(event, listener);
                this.setMaxListeners(this.getMaxListeners() - 1);
            };
            this.on(event, listener);
            this.setMaxListeners(this.getMaxListeners() + 1);
        });
    }
}
