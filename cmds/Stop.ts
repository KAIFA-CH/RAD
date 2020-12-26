import { rad } from "../start"
import * as Discord from "discord.js"

function msToTime(ms) {
    let sec = Math.floor(ms / 1000)
    let hrs = Math.floor(sec / 3600)
    sec -= hrs * 3600
    let min = Math.floor(sec / 60)
    sec -= min * 60
    //@ts-ignore
    sec = '' + sec
    //@ts-ignore
    sec = ('00' + sec).substring(sec.length)

    if (hrs > 0) {
        //@ts-ignore
        min = '' + min
        //@ts-ignore
        min = ('00' + min).substring(min.length)
        return hrs + ":" + min + ":" + sec
    } else {
        return min + ":" + sec
    }
}

module.exports = {
    name: 'Stop',
    description: 'Stop playing a Station',
    category: 'General',
    hide: false,
    perms: [],
    args: false,
    execute(message, args) {
        //@ts-ignore
        const connection = rad.voice.connections.find(vc => vc.channel.id === message.member.voice.channelID)
        if (!connection) return message.channel.send('I\'m not playing in this guild.')

        //@ts-ignore
        const info = rad.radios.find(station => station.name.toLowerCase() === rad.playing.find(guild => guild.id === message.guild.id).station)

        const embed = new Discord.MessageEmbed()
            .setColor(7664119)
            .setAuthor(`${rad.user.username} | Prefix: ${process.env.prefix}`, rad.user.displayAvatarURL())
            .setDescription(`**Stopped playing station: ${info.name}**\nTotal playback time: ${msToTime(connection.dispatcher.streamTime)}`)
            .setThumbnail(info.logo)
            //@ts-ignore
            .setFooter(`Playback was started by ${message.guild.members.cache.get(rad.playing.find(guild => guild.id === message.guild.id).requested).displayName}`, message.guild.members.cache.get(rad.playing.find(guild => guild.id === message.guild.id).requested).user.avatarURL())

        //@ts-ignore
        rad.playing.delete(message.guild.name)

        connection.channel.leave()

        message.channel.send({ embed })
    }
};