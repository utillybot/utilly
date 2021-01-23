import { Logger } from '@utilly/utils';
import { Connection, createConnection } from 'typeorm';
import { Guild } from './entities/Guild';
import { TypeORMLogger } from './TypeORMLogger';
import { Service } from '@utilly/di/dist';

@Service()
export class Database {
	connection!: Connection;

	constructor(
		private readonly _databaseUrl: string,
		private readonly _logger: Logger
	) {}

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
		});

		this._logger.database('Connection has been established successfully.');
	}
}
