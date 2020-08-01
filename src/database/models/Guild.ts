import { DataTypes, Model } from 'sequelize';
import UtillyClient from '../../bot';

export class Guild extends Model {
    public guildID!: number;

    public prefix!: string[];

    // Logging Module
    public logging!: boolean;

    public logging_messageLogChannel!: number | null;
    public logging_messageDelete!: boolean;
    public logging_messageUpdate!: boolean;
    public logging_messageDeleteBulk!: boolean;

    public logging_serverLogChannel!: number | null;
    public logging_channelCreate!: boolean;
    public logging_channelDelete!: boolean;
    public logging_channelUpdate!: boolean;
    public logging_guildRoleCreate!: boolean;
    public logging_guildRoleDelete!: boolean;
    public logging_guildRoleUpdate!: boolean;

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
