import { ShardingManager } from "discord.js"
import * as AutoPoster from "topgg-autoposter"
import * as dotenv from "dotenv"
dotenv.config()

const manager = new ShardingManager('./bot.js', { token: process.env.key })

//@ts-ignore
const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTQwODI4MDY3OTY3Nzk5MyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTg2NTcwNTg4fQ.fiHJWNnz4uPusuUt8BRiDoQVDOwmt20Jz9j0ArwVE-k', manager)

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))
manager.spawn()