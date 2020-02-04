const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "queue",
    usage: "queue",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "shows the queue",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(client.queue.get(message.guild.id) == undefined) return message.channel.send('Nothing is playing!')
        let queue = client.queue.get(message.guild.id).songs
        let queueEmbed = new Discord.RichEmbed();
        queueEmbed.setTitle(`Queue`)
        queueEmbed.setColor('RANDOM')
        queueEmbed.setDescription(queue.map((s,i) => `**${i+1}**: [${s.info.title} by ${s.info.author}](${s.info.uri})`))
        queueEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        return message.channel.send({embed: queueEmbed})
      
    }
}