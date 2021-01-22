import { Logger } from '@utilly/utils';
import { Connection, createConnection } from 'typeorm';
import { Guild } from './entities/Guild';
import { TypeORMLogger } from './TypeORMLogger';

export class Database {
	connection!: Connection;
	private _logger: Logger;
	private _databaseUrl: string;

	constructor(databaseUrl: string, logger: Logger) {
		this._logger = logger;
		this._databaseUrl = databaseUrl;
	}

	async connect(): Promise<void> {
		this.connection = await createConnection({
			type: 'postgres',
			url: this._databaseUrl,
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
			entities: [Guild],
			logging: true,
			logger: new TypeORMLogger(this._logger),

			synchronize: true,
		});

		this._logger.database('Connection has been established successfully.');
	}
}
