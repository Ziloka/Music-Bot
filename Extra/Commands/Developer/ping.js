const Discord = require('discord.js');
const ms = require('ms')

module.exports = {
    name: "ping",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "displays latency",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(client.developers.some(ID => ID == message.author.id) == false) return;
        let msg = await message.channel.send('Ping!')
        let pingEmbed = new Discord.RichEmbed()
        pingEmbed.setTitle('Ping!')
        pingEmbed.setColor('RANDOM')
        pingEmbed.addField('Pings', Math.round(client.ping))
        pingEmbed.addField('API', ms(Math.round(message.createdTimestamp - msg.createdTimestamp, { long: true })))
        return msg.edit({embed: pingEmbed})
        
    }
}