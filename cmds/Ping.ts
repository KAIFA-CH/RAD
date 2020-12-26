import { rad } from "../start"

module.exports = {
	name: 'Ping',
	description: 'Pong!',
	category: 'Testing',
	hide: true,
	perms: ['ADMINISTRATOR'],
	args: false,
	execute(message, args) {
		message.channel.send("Ping!").then(m => {
			m.edit(`🏓 Latency is **${m.createdTimestamp - message.createdTimestamp}ms** - API Latency is **${Math.round(rad.ws.ping)}ms**`);
		})
	}
};