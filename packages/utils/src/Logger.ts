import style from 'ansi-styles';

export class Logger {
    private _off: boolean;

    constructor(off = false) {
        this._off = off;
    }

    database(msg: string): void {
        if (!this._off)
            console.log(
                `${style.magenta.open}${style.bold.open}[Database] ${style.bold.close}${style.magenta.close}`,
                msg
            );
    }

    handler(msg: string): void {
        if (!this._off)
            console.log(
                `${style.green.open}${style.bold.open}[Handler] ${style.bold.close}${style.green.close}`,
                msg
            );
    }

    gateway(msg: string): void {
        if (!this._off)
            console.log(
                `${style.blue.open}${style.bold.open}[Gateway] ${style.bold.close}${style.blue.close}`,
                msg
            );
    }

    error(error: string, ...args: string[]): void {
        if (!this._off)
            console.error(
                `${style.red.open}${style.bold.open}[Error] ${style.bold.close}${style.red.close}`,
                error,
                args
            );
    }

    log(msg: string): void {
        if (!this._off)
            console.log(
                `${style.white.open}${style.bold.open}[Log] ${style.bold.close}${style.white.close}`,
                msg
            );
    }
}
