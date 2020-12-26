import { rad } from "../start"
import * as Discord from "discord.js"

module.exports = {
    name: 'vol',
    description: 'Change Volume',
    category: 'General',
    hide: false,
    perms: [],
    args: true,
    usage: 'Please provide the volume 5-100',
    execute(message, args) {
      if(!rad.playing.find(guild => guild.id == message.guild.id)) return message.channel.send(`I'm not playing in this guild so volume will not be changed.`)
    }
}
