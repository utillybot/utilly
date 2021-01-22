import { CommandInfo } from '../Command';
import { CommandModuleInfo } from '../CommandModule';
import { CommandHook } from '../CommandHook';

export type CommandMetadata = Partial<CommandInfo>;

export const CommandSymbol = Symbol('@utilly/framework:command');

export type CommandModuleMetadata = Partial<CommandModuleInfo>;

export const CommandModuleSymbol = Symbol('@utilly/framework:commandModule');

export type PreHookMetadata = CommandHook[];

export const PreHookSymbol = Symbol('@utilly/framework:preHook');
