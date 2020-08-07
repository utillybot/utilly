import { Logger as TypeLogger } from 'typeorm';
import Logger from '../core/Logger';

export class TypeORMLogger implements TypeLogger {
    logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    logQuery(query: string): void {
        this.logger.database(`Query: ${query}`);
    }

    logQueryError(error: string, query: string): void {
        this.logger.database(`Error: ${error}\nOn Query: ${query}`);
    }

    logQuerySlow(time: number, query: string): void {
        this.logger.database(`Slow Query: ${query}\nElapsed time: ${time}`);
    }

    logSchemaBuild(message: string): void {
        this.logger.database(`Schema Build: ${message}`);
    }

    logMigration(message: string): void {
        this.logger.database(`Migration: ${message}`);
    }

    log(level: 'log' | 'info' | 'warn', message: string): void {
        this.logger.database(`Log: ${level}\nMessage: ${message}`);
    }
}
