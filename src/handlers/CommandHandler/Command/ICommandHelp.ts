export default interface ICommandHelp {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
    permission?: string;
}
