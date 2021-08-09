import { ShardingManager } from "discord.js"
import * as dotenv from "dotenv"
dotenv.config()

const manager = new ShardingManager('./bot.js', { token: process.env.key })

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)
    shard.on('message', (message) => {
        if(message === 'refreshlist') {
            manager.broadcast('updateradios')
        }
    })
})

manager.spawn()
