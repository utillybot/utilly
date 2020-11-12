import type { UtillyClient } from '../../UtillyClient';
import { Module } from './Module';

/**
 * A module that has a parent of another module
 */
export abstract class Submodule extends Module {
	parentModule: Module;

	protected constructor(bot: UtillyClient, parentModule: Module) {
		super(bot);
		this.parentModule = parentModule;
	}
}
