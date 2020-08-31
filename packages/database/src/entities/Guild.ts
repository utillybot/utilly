/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Guild {
    [key: string]: string | boolean | null | string[];

    @PrimaryColumn('numeric', { precision: 18 })
    public guildID!: string;

    @Column('varchar', { array: true, default: '{u!}', length: 5 })
    public prefix!: string[];

    // Logging Module
    @Column({ nullable: false, default: false })
    public logging!: boolean;

    // Message Delete
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_messageDeleteChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_messageDeleteEvent!: boolean;

    //Message Update
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_messageUpdateChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_messageUpdateEvent!: boolean;

    //Message Delete Bulk
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_messageDeleteBulkChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_messageDeleteBulkEvent!: boolean;

    //Channel Create
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_channelCreateChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_channelCreateEvent!: boolean;

    //Channel Delete
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_channelDeleteChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_channelDeleteEvent!: boolean;

    //Channel Update
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_channelUpdateChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_channelUpdateEvent!: boolean;

    //Guild Role Create
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_guildRoleCreateChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_guildRoleCreateEvent!: boolean;

    // Guild Role Delete
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_guildRoleDeleteChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_guildRoleDeleteEvent!: boolean;

    //Guild Role Update
    @Column('numeric', { nullable: true, precision: 18 })
    public logging_guildRoleUpdateChannel!: string | null;

    @Column({ nullable: false, default: false })
    public logging_guildRoleUpdateEvent!: boolean;

    // Info Module
    @Column({ nullable: false, default: false })
    public info!: boolean;
}
