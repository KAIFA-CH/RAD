import * as Discord from "discord.js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as Cloudant from "@cloudant/cloudant"
const decache = require('decache')
const DBL = require('dblapi.js')
dotenv.config()

const rad = new Discord.Client()
let fsWait = false

const cloudant = Cloudant(process.env.db)
const db = cloudant.use('rad')

const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTQwODI4MDY3OTY3Nzk5MyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTg2NTcwNTg4fQ.fiHJWNnz4uPusuUt8BRiDoQVDOwmt20Jz9j0ArwVE-k', rad)

//@ts-ignore
rad.radios = new Discord.Collection()

//@ts-ignore
rad.cmds = new Discord.Collection()

//@ts-ignore
rad.playing = new Discord.Collection()

const cmds = fs.readdirSync('./cmds').filter(file => file.endsWith('.ts') || file.endsWith('.js'))

for (const file of cmds) {
    const command = require(`./cmds/${file}`)

    //@ts-ignore
    rad.cmds.set(command.name.toLowerCase(), command)

    fs.watch(`./cmds/${file}`, (event, filename) => {
        if (filename && event == "change") {
            if (fsWait) return;

            //@ts-ignore
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);

            decache(`./cmds/${file}`)

            const command = require(`./cmds/${file}`);

            //@ts-ignore
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
    //@ts-ignore
    rad.radios.clear()

    //@ts-ignore
    await db.partitionedList('radios', { include_docs: true }).then(res => {
        res.rows.forEach(function (row) {
            var name = unicodeToChar(row.doc.name)
            var url = unicodeToChar(row.doc.url)
            var img = unicodeToChar(row.doc.img)
            var desc = unicodeToChar(row.doc.desc)

            //@ts-ignore
            rad.radios.set(name.toLowerCase(), { name: name, genre: desc, stream: url, logo: img })
        })
    })
}

rad.on("ready", async () => {
    console.log(`Logged in as: ${rad.user.tag}`)
    getradios()
    rad.setInterval(() => {
        //@ts-ignore
        rad.user.setActivity("in " + rad.playing.size + " VCs | Prefix: r!", { type: "PLAYING" })
    }, 60000)
})

rad.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.guild.me.voice.channel && newState.guild.me.voice.channel.members.size === 1) {
        newState.guild.me.voice.channel.leave()

        //@ts-ignore
        rad.playing.delete(newState.guild.name)
    }
    if (oldState.member.user.username === rad.user.username && !newState.member.voice.channel) {
        //@ts-ignore
        rad.playing.delete(oldState.guild.name)
    }
});

rad.on('message', message => {
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/g)

    args.forEach((part, index) => {
        args[index] = args[index].replace(/([()[{}*+$^\\])/g, '')
        args[index] = args[index].replace(/"/g, '')
    })

    const command = args.shift().toLowerCase()

    if(command === "refresh" && message.author.id === "82662823523516416") {
        getradios()
        return message.channel.send(`Radio List has been updated!`)
    }

    //@ts-ignore
    if (!rad.cmds.has(command)) return

    //@ts-ignore
    if (rad.cmds.get(command).args && !args.length) {
        //@ts-ignore
        if (rad.cmds.get(command).usage) return message.channel.send(`You didn't provide any arguments! Please provide the following argument or Follow the instructions:\n\n${rad.cmds.get(command).usage}`)

        return message.channel.send(`You didn't provide any arguments!`)
    }

    try {
        //@ts-ignore
        if (message.member.hasPermission(rad.cmds.get(command).perms)) {
            //@ts-ignore
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