import { Submodule } from './Submodule';

/**
 * A module that can be attached to a client to listen for events. These modules are submodules.
 */
export abstract class AttachableModule extends Submodule {
	/**
	 * Attaches to the client to start listening for events
	 */
	abstract attach(): void;
}
