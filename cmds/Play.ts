import { rad } from "../bot"
import * as Discord from "discord.js"

module.exports = {
    name: 'Play',
    description: 'Play a Station',
    category: 'General',
    hide: false,
    perms: [],
    args: true,
    usage: 'Please provide a Station name.\nif the station has a space in the name then do the following r!play "(Radio Name)"',
    execute(message, args) {
        const station = rad.radios.find(station => station.name.toLowerCase() == args[0].toLowerCase())

        if (!station) return message.channel.send('Station is not in our database.\nIf it is listed in r!radios check the spelling.')
        
        if (rad.playing.find(guild => guild.id === message.guild.id)) return message.channel.send('I\'m already playing in this guild.')

        if (message.guild.me.voice.connection) return message.channel.send('I\'m already playing in this guild.')

        if (message.member.voice.channel && !message.member.voice.channel.full) {
            message.member.voice.channel.join().then(connection => {
                const dispatcher = connection.play(rad.radios.get(args[0].toLowerCase()).stream)
                dispatcher.setVolume(0.5)

                rad.playing.set(message.guild.name, { id: message.guild.id, station: args[0].toLowerCase(), requested: message.author.id })

                const embed = new Discord.MessageEmbed()
                    .setColor(7664119)
                    .setAuthor(`${rad.user.username} | Prefix: ${process.env.prefix}`, rad.user.displayAvatarURL())
                    .setThumbnail(station.logo)
                    .setDescription(`**Started playing station: ${station.name}**`)
                    .setFooter(`Station requested by ${message.member.displayName}`, message.author.avatarURL())

                message.channel.send({ embed })
            })
        }
    }
};
