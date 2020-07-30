# Modules

Utilly is based off the concept of Modules. Modules are parts of the bot that can be enabled, disabled, and configured to the user's liking. A Module has two parts: the frontened, and the backend.

## The Backend

The backend of the module consists of the base module class, the attachable sub modules and the database entr(y/ies).

### The Base Module Class

The base module class includes all the functions that the frontend and backend need to interface with other APIs or the database. A database query method or a method to interface with a YouTube API would go here.

#### Database Module

These modules are base modules that corrospond to a database key.

### The Submodules

The submodules are modules that output to discord, but do not require user input. These modules point to a parent module, which is a base module that contains all the utility methods

#### Attachable Submodules

Attachable Submodules are submodules that listen to discord events and respond accordingly. These are the most common types of Submodules

## The Frontend

The frontend of the module is the command group uses the backend. The frontend consists of command groups, and commands.

### Command Groups

Command Groups contain commands in them. Theses groups, otherwise known as CommandModules, corrospond to a backend module.

### Command

Commands are the way that the user can interact with the bot. These commands provide a direct response to the user. These commands can call utility methods from the backend of the corrosponding CommandModule.

## Example

This example is of a logging Module.

### Database Entry

The database entry is `logging`. If we had the settings, `serverLogChannel` and `messageLogChannel`, the database columns would look like this.

| entry                     | type    |
| ------------------------- | ------- |
| logging                   | boolean |
| logging_serverLogChannel  | string  |
| logging_messageLogChannel | string  |

As you can see, we have the 'logging' entry which says if the modules is enabled. Then any module settings are prefixed with 'logging\_'.

### The Base Module Class

The base module class would have methods to get the log channels from the database as well as check if the module is enabled.

### The attachable submodules

The attachable submodules would each attach to the client to listen to events and then log them in the log channels if the module was enabled. They will be linked to the base module class.

### Command Groups

The 'logging' command group would be linked to the base module class

### Commands

The commands seen by the users would be to set the log channels.
