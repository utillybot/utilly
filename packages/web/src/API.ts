interface StatsResponse {
	guilds: number;
	users: number;
}

export async function fetchStats(): Promise<StatsResponse | undefined> {
	const response = await fetch('/api/stats');
	if (response.status == 200) {
		return await response.json();
	}
	return undefined;
}

export interface CommandModule {
	name: string;
	description: string;
	commands: Command[];
}

export interface Command {
	name: string;
	description: string;
	usage: string;
	triggers: string[];
}

export interface CommandsResponse {
	commandModules: CommandModule[];
}

const fetchCommands = async (): Promise<CommandsResponse> => {
	return await (await fetch('/api/commands')).json();
};

export interface Resource<T> {
	read(): T;
}

const wrapPromise = <T>(promise: Promise<T>): Resource<T> => {
	let status = 'pending';
	let result: T;
	let error: Error;
	const suspender = promise
		.then(r => {
			status = 'success';
			result = r;
		})
		.catch(e => {
			status = 'error';
			error = e;
		});

	return {
		read() {
			if (status == 'pending') {
				throw suspender;
			} else if (status == 'error') {
				throw error;
			} else {
				return result;
			}
		},
	};
};

export const get = (): { commands: Resource<CommandsResponse> } => {
	return {
		commands: wrapPromise(fetchCommands()),
	};
};
