import * as Discord from "discord.js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as Cloudant from "@cloudant/cloudant"

const decache = require('decache')
dotenv.config()

const rad = new Discord.Client()
let fsWait = false

const cloudant = Cloudant(process.env.db)
const db = cloudant.use('rad')

rad.radios = new Discord.Collection()

rad.cmds = new Discord.Collection()

rad.playing = new Discord.Collection()

const cmds = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'))

for (const file of cmds) {
    const command = require(`./cmds/${file}`)

    rad.cmds.set(command.name.toLowerCase(), command)

    fs.watch(`./cmds/${file}`, (event, filename) => {
        if (filename && event == "change") {
            if (fsWait) return

            //@ts-ignore
            fsWait = setTimeout(() => {
                fsWait = false
            }, 100)

            decache(`./cmds/${file}`)

            const command = require(`./cmds/${file}`)

            rad.cmds.set(command.name.toLowerCase(), command)
        }
    });
}

function unicodeToChar(text: string) {
    return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
}

async function getradios() {
    rad.radios.clear()

    //@ts-ignore
    await db.partitionedList('radios', { include_docs: true }).then(res => {
        res.rows.forEach(function (row) {
            var name = unicodeToChar(row.doc.name)
            var url = unicodeToChar(row.doc.url)
            var img = unicodeToChar(row.doc.img)
            var desc = unicodeToChar(row.doc.desc)

            rad.radios.set(name.toLowerCase(), { name: name, genre: desc, stream: url, logo: img })
        })
    })
}

rad.on("ready", async () => {
    console.log(`Logged in as: ${rad.user.tag}`)
    getradios()
    rad.setInterval(async () => {
        const globplay = await rad.shard.fetchClientValues('playing.size')
        rad.user.setActivity("in " + globplay.reduce((acc, count) => acc + count, 0) + " VCs | Prefix: r!", { type: "PLAYING" })
    }, 60000)
})

rad.on('guildDelete', guild => {
	if(rad.playing.find(g => g.id === guild.id)) {
		rad.playing.delete(guild.name)
	}
})

rad.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.guild.me.voice.channel && newState.guild.me.voice.channel.members.size === 1) {
        newState.guild.me.voice.channel.leave()

        rad.playing.delete(newState.guild.name)
    }
    if (oldState.member.user.username === rad.user.username && !newState.member.voice.channel) {
        rad.playing.delete(oldState.guild.name)
    }
});

process.on('message', async message => {
    if(message === 'updateradios') return await getradios()
})

rad.on('message', message => {
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g)

    args.forEach((part, index) => {
        args[index] = args[index].replace(/([()[{}*+$^\\])/g, '')
        args[index] = args[index].replace(/"/g, '')
    })

    const command = args.shift().toLowerCase()

    if(command === "refresh" && message.author.id === "82662823523516416") {
        rad.shard.send('refreshlist')
        return message.channel.send(`Radio List has been updated!`)
    }

    if (!rad.cmds.has(command)) return

    if (rad.cmds.get(command).args && !args.length) {
        if (rad.cmds.get(command).usage) return message.channel.send(`You didn't provide any arguments! Please provide the following argument or Follow the instructions:\n\n${rad.cmds.get(command).usage}`)

        return message.channel.send(`You didn't provide any arguments!`)
    }

    try {
        if (message.member.hasPermission(rad.cmds.get(command).perms)) {
            rad.cmds.get(command).execute(message, args)
        } else {
            throw new Error("Invalid Permissions")
        }
    } catch (e: any) {
        console.error(e);
    }
})

rad.login(process.env.key)

export { rad }