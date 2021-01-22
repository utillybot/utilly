import { Logger } from '@utilly/utils';
import { Logger as TypeLogger } from 'typeorm';

export class TypeORMLogger implements TypeLogger {
	private _logger: Logger;

	constructor(logger: Logger) {
		this._logger = logger;
	}

	logQuery(query: string): void {
		this._logger.database(`Query: ${query}`);
	}

	logQueryError(error: string, query: string): void {
		this._logger.database(`Error: ${error}\nOn Query: ${query}`);
	}

	logQuerySlow(time: number, query: string): void {
		this._logger.database(`Slow Query: ${query}\nElapsed time: ${time}`);
	}

	logSchemaBuild(message: string): void {
		this._logger.database(`Schema Build: ${message}`);
	}

	logMigration(message: string): void {
		this._logger.database(`Migration: ${message}`);
	}

	log(level: 'log' | 'info' | 'warn', message: string): void {
		this._logger.database(`Log: ${level}\nMessage: ${message}`);
	}
}
