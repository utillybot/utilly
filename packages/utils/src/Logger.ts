import chalk from 'chalk';

interface LoggerOptions {
    database?: boolean;
    handler?: boolean;
    web?: boolean;
    gateway?: boolean;
}

export class Logger {
    options: LoggerOptions;

    constructor(options?: LoggerOptions) {
        this.options = Object.assign(
            {
                database: true,
                handler: true,
                web: true,
                gateway: true,
            },
            options
        );
    }

    database(msg: string): void {
        if (this.options.database)
            console.log(chalk.magenta.bold(`[Database] `), msg);
    }

    handler(msg: string): void {
        if (this.options.handler)
            console.log(chalk.green.bold(`[Handler] `), msg);
    }

    web(msg: string): void {
        if (this.options.web) console.log(chalk.cyan.bold(`[Web] `), msg);
    }

    gateway(msg: string): void {
        if (this.options.gateway)
            console.log(chalk.blue.bold(`[Gateway] `), msg);
    }

    error(error: string, ...args: string[]): void {
        console.error(chalk.red.bold(`[Error] `), error, args);
    }

    log(msg: string): void {
        console.log(chalk.white.bold(`[Log] `), msg);
    }
}
