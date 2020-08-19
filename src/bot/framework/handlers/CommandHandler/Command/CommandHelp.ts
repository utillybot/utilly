export default interface CommandHelp {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
    permission?: string;
}
