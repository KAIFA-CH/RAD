import { rad } from "../bot"

module.exports = {
    name: 'vol',
    description: 'Change Volume',
    category: 'General',
    hide: false,
    perms: [],
    args: true,
    usage: 'Please provide the volume 10-100%',
    execute(message, args) {
        if(!rad.playing.find(guild => guild.id == message.guild.id)) return message.channel.send(`I'm not playing in this guild so volume will not be changed.`)
        
        //Get connection and fail if connection doesn't exist.Get dispatcher volume and Parse the number from the first argument
        const connection = rad.voice.connections.find(vc => vc.channel.id == message.member.voice.channelID)
        if(!connection) return message.channel.send(`You're not in the VC`)
        let volume = parseInt(args[0])
        let oldvolume = connection.dispatcher.volume

        //Check for any issues
        //if(!args[0].endsWith('%')) return message.channel.send(`It seems like you provided an invalid value make sure to end it with %`)
        if(volume / 100.0 == oldvolume) return message.channel.send(`Couldn't change volume as the current volume already is ${volume}%`)
        if(isNaN(volume)) return message.channel.send(`You did not provide a number`)
        if(volume < 10 || volume > 100) return message.channel.send(`You provided a number out of the range! Please do a number between 10-100%`)

        //Set volume and responded with a message
        connection.dispatcher.setVolume(volume / 100.0)
        return message.channel.send(`Volume sucessfully changed from ${oldvolume * 100.0}% to ${volume}%`)
    }
}