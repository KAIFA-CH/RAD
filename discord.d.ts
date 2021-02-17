declare module "discord.js" {
    export interface Client {
        radios: Collection<unknown, any>,
        cmds: Collection<unknown, any>,
        playing: Collection<unknown, any>
    }
}