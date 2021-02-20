import * as Discord from "discord.js"
import { rad } from "../bot"

module.exports = {
	name: 'Help',
	description: '',
	category: 'About',
    hide: true,
    perms: [],
	execute(message, args) {
        const categorytest = rad.cmds.filter(command => command.category == "Testing" && command.hide == false)

        const categoryabout = rad.cmds.filter(command => command.category == "About" && command.hide == false)

        const categoryfun = rad.cmds.filter(command => command.category == "Fun" && command.hide == false)

        const categorygen = rad.cmds.filter(command => command.category == "General" && command.hide == false)

        const embed = new Discord.MessageEmbed()
        embed.setColor(16312092)
        embed.setTitle("List of Commands")
        embed.setDescription("This shows all available commands")

        if(categorytest.size > 0) {
            var categoryarray = []
            categorytest.forEach(command => {
                categoryarray.push("`"+command.name.toLowerCase()+"`: "+command.description)
            })
            embed.addField("Testing", categoryarray)
        }

        if(categoryabout.size > 0) {
            var categoryarray = []
            categoryabout.forEach(command => {
                categoryarray.push("`"+command.name.toLowerCase()+"`: "+command.description)
            })
            embed.addField("About", categoryarray)
        }

        if(categorygen.size > 0) {
            var categoryarray = []
            categorygen.forEach(command => {
                categoryarray.push("`"+command.name.toLowerCase()+"`: "+command.description)
            })
            embed.addField("General", categoryarray)
        }

        if(categoryfun.size > 0) {
            var categoryarray = []
            categoryfun.forEach(command => {
                categoryarray.push("`"+command.name.toLowerCase()+"`: "+command.description)
            })
            embed.addField("Fun", categoryarray)
        }
            
        message.channel.send({embed})
	}
};