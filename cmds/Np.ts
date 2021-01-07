import { rad } from "../start"
import * as Discord from "discord.js"
const axios = require("axios")

module.exports = {
    name: 'Np',
    description: 'Shows the currently playing station song',
    category: 'General',
    hide: false,
    perms: [],
    args: false,
    async execute(message, args) {
        //@ts-ignore
        const playing = rad.playing.find(guild => guild.id === message.guild.id)

        if (!playing) return message.channel.send('I\'m not playing in this guild.')

        //@ts-ignore
        const station = rad.radios.find(station => station.name.toLowerCase() == playing.station)

        const fetch = await axios.get(`https://api.radbot.tech/${station.name}`)

        let name = fetch.data.title

        const embed = new Discord.MessageEmbed()
            .setColor(7664119)
            .setAuthor(`${rad.user.username} | Prefix: ${process.env.prefix}`, rad.user.displayAvatarURL())
            .setDescription(`Currently Playing: **${name}** \n Current Volume: **${message.guild.voice.connection.dispatcher.volume * 100.0}%**`)
            .setThumbnail(station.logo)
            //@ts-ignore
            .setFooter(`Playback was started by ${message.guild.members.cache.get(playing.requested).displayName}`, message.guild.members.cache.get(playing.requested).user.avatarURL())

        message.channel.send({ embed })
    }
}
