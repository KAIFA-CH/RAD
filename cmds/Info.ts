import * as Discord from "discord.js"
import * as dotenv from "dotenv"
import { rad } from "../start"
import * as getos from "getos"
dotenv.config()

let OS = ''

getos(function(e,os) {
    if(e) return OS = 'Unknown'
    OS = os.dist + ' ' + os.release
})

module.exports = {
    name: 'Info',
    description: 'Get information about the bot',
    category: 'About',
    hide: false,
    perms: [],
    args: false,
	execute(message, args) {
        var totalSeconds = (rad.uptime / 1000)
        var days = Math.floor(totalSeconds / 86400)
        var hours = Math.floor(totalSeconds / 3600) - days*24
        totalSeconds %= 3600
        var minutes = Math.floor(totalSeconds / 60)
        var seconds = Math.floor(totalSeconds % 60)

        const embed = new Discord.MessageEmbed()
            .setColor(7664119)
            .setAuthor(`${rad.user.username} | Prefix: ${process.env.prefix}`, rad.user.displayAvatarURL())
            .addField('Operating System', OS)
            .addField('Version', '1.0.5', true)
            .addField('NodeJS', '14.11.0', true)
            .addField('Library', '[discord.js](https://discord.js.org/)', true)
            .addField('Guilds', rad.guilds.cache.size, true)
            .addField('Users', rad.users.cache.size, true)
            .addField(`Support`, `[Join Server](https://discord.gg/ayVdTbX)`, true)
            .addField('Uptime', `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`)
            .setFooter('Developed by Maroxy#4964', rad.users.cache.get('82662823523516416').avatarURL({ dynamic: true, size: 256 }))
        
		message.channel.send({embed})
	}
};
