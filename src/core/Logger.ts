import chalk from 'chalk';

export default class Logger {
    off: boolean;

    constructor(off = false) {
        this.off = off;
    }
    database(msg: string): void {
        if (!this.off) console.log(chalk.magenta.bold('[Database] '), msg);
    }

    handler(msg: string): void {
        if (!this.off) console.log(chalk.green.bold('[Handler] '), msg);
    }

    gateway(msg: string): void {
        if (!this.off) console.log(chalk.blue.bold('[Gateway] '), msg);
    }

    error(error: string, ...args: string[]): void {
        if (!this.off) console.error(chalk.red.bold('[Error] '), error, args);
    }

    log(msg: string): void {
        if (!this.off) console.log(chalk.white.bold('[Log]'), msg);
    }
}
