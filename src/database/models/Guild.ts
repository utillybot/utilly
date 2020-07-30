import { DataTypes, Model } from 'sequelize';
import UtillyClient from '../../bot';

export class Guild extends Model {
    guildID: number;

    prefix: string[];

    // Logging Module
    logging: boolean;

    logging_messageLogChannel?: number;
    logging_messageDelete: boolean;
    logging_messageUpdate: boolean;
    logging_messageDeleteBulk: boolean;

    logging_serverLogChannel?: number;
    logging_channelCreate: boolean;
    logging_channelDelete: boolean;
    logging_channelUpdate: boolean;
    logging_guildRoleCreate: boolean;
    logging_guildRoleDelete: boolean;
    logging_guildRoleUpdate: boolean;

    toggleModule(module: string): void {
        if (this.get(module)) {
            this.set(module, false);
        } else {
            this.set(module, true);
        }
    }
}

export const initGuildModel = (bot: UtillyClient): void => {
    Guild.init(
        {
            guildID: {
                type: DataTypes.DECIMAL(18),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },

            prefix: {
                type: DataTypes.ARRAY(DataTypes.STRING(5)),
                allowNull: false,
                defaultValue: ['u!'],
            },

            // Logging Module
            logging: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            // Message Logs
            logging_messageLogChannel: {
                type: DataTypes.DECIMAL(18),
            },

            logging_messageDelete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            logging_messageUpdate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            logging_messageDeleteBulk: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            // Guild logs
            logging_serverLogChannel: {
                type: DataTypes.DECIMAL(18),
            },

            logging_channelCreate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            logging_channelDelete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            logging_channelUpdate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            logging_guildRoleCreate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            logging_guildRoleDelete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            logging_guildRoleUpdate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        { sequelize: bot.database.sequelize }
    );
};
