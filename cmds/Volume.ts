import { rad } from "../start"

module.exports = {
    name: 'vol',
    description: 'Change Volume',
    category: 'General',
    hide: false,
    perms: [],
    args: true,
    usage: 'Please provide the volume 10-100',
    execute(message, args) {
        //@ts-ignore
        if(!rad.playing.find(guild => guild.id == message.guild.id)) return message.channel.send(`I'm not playing in this guild so volume will not be changed.`)

        const connection = rad.voice.connections.find(vc => vc.channel.id == message.member.voice.channelID)
        if(!connection) return message.channel.send(`You're not in the VC`)

        let volume = parseInt(args[0])
        let oldvolume = connection.dispatcher.volume

        if(isNaN(volume)) return message.channel.send(`You did not provide a number`)
        if(volume < 10 || volume > 100) return message.channel.send(`You provided a number out of the range! Please do a number between 10-100`)

        connection.dispatcher.setVolume(volume / 100.0)

        return message.channel.send(`Volume sucessfully changed from ${oldvolume * 100.0} to ${volume}`)
    }
}
