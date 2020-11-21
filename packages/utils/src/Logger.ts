import chalk from 'chalk';

interface LoggerOptions {
	database?: boolean;
	handler?: boolean;
	web?: boolean;
	gateway?: boolean;
}

export class Logger {
	options: LoggerOptions;
	colors: Record<string, string>;

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

		this.colors = {
			database: '#ff00ff',
			handler: '#00ff00',
			web: '#00ffff',
			gateway: '#007aff',
			log: '#ffffff',
		};
	}

	database(msg: string): void {
		if (this.options.database) this._log('database', msg);
	}

	handler(msg: string): void {
		if (this.options.handler) this._log('handler', msg);
	}

	web(msg: string): void {
		if (this.options.web) this._log('web', msg);
	}

	gateway(msg: string): void {
		if (this.options.gateway) this._log('gateway', msg);
	}

	error(error: string, ...args: string[]): void {
		console.error(chalk.red('error'), error, args);
	}

	log(msg: string): void {
		this._log('log', msg);
	}

	_log(header: string, msg: string): void {
		process.stdout.write(
			`${chalk.grey('[Utilly]')} ${chalk.bold.underline
				.hex(this.colors[header])(header)
				.padStart(9, ' ')}${msg}\n`
		);
	}
}
