import type { CommandInfo } from '../Command';
import type { CommandModuleInfo } from '../CommandModule';
import type { CommandHook } from '../CommandHook';

export type CommandMetadata = Partial<CommandInfo>;

export const CommandSymbol = Symbol('Utilly Bot Command');

export type CommandModuleMetadata = Partial<CommandModuleInfo>;

export const CommandModuleSymbol = Symbol('Utilly Bot Command Module');

export type PreHookMetadata = CommandHook[];

export const PreHookSymbol = Symbol('Utilly Bot PreHook');
