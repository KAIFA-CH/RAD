const owo = require('owofy');

module.exports = {
	name: 'OwOfy',
	description: 'Turn your text into owo speech',
	category: 'Fun',
	hide: false,
	perms: [],
	args: true,
	usage: '"Text to OwOfy"',
	execute(message, args) {
		message.channel.send(owo(args[0]))
	}
};