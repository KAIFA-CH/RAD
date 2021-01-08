import { rad } from "../start"
import * as Discord from "discord.js";

module.exports = {
	name: 'Radios',
	description: 'View All Stations',
	category: 'General',
	hide: false,
	perms: [],
	args: false,
	execute(message, args) {
		if(!message.channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'])) return message.channel.send(`Permissions missing!\nPlease make sure I can use following permissions in this channel/category:\nManage Messages, Add Reactions, Embed Links`)

		const radios = Array.from(rad.radios)

		const generateEmbed = start => {
			const current = radios.slice(start, start + 5)
		  
			const embed = new Discord.MessageEmbed()
				  .setTitle(`Stations`)
				  .setAuthor(`${rad.user.username} | Prefix: ${process.env.prefix}`, rad.user.displayAvatarURL())
				  .setColor(0x00ffff)
				  .setFooter(`Showing ${start + 1} to ${start + current.length} stations out of ${radios.length}`, 'https://cdn.icon-icons.com/icons2/1502/PNG/512/officedatabase_103574.png')

			current.forEach(radio => embed.addField(rad.radios.get(radio[0]).name, `**Genres:** ${rad.radios.get(radio[0]).genre}`))
			return embed
		  }
		  
		  const author = message.author
		  
		  message.channel.send(generateEmbed(0)).then(message => {

			if (radios.length <= 5) return
			message.react('⬅️')
			message.react('➡️')
			const collector = message.createReactionCollector(
			  (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
			  {time: 10000}
			)
		  
			let currentIndex = 0
			collector.on('collect', reaction => {
			  reaction.users.remove(author.id).then(async () => {

				reaction.emoji.name === '⬅️' ? currentIndex -= 5 : currentIndex += 5

				if (currentIndex > radios.length) currentIndex -= 5
				if(currentIndex < 0) currentIndex = 0

				message.edit(generateEmbed(currentIndex))

				collector.resetTimer();
			  })
			})
			collector.on('end', reaction => {
				message.reactions.removeAll()
			})
		  })
		  		  
	}
};
