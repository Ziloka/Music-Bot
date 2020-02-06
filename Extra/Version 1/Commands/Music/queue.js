const Discord = require('discord.js');

module.exports = {
    name: "queue",
    usage: "queue",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "displays the queue",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(client.queue.has(message.guild.id) == false) return message.channel.send('Nothing is playing!')
        let queue = new Discord.RichEmbed()
        queue.setTitle(`Queue`)
        queue.setDescription(`${client.queue.get(message.guild.id).queue.map((song, index) => `${index+1}: [${song.songTitle}](${song.url}) Requested by ${song.requester.tag}`).join('\n')}`)
        queue.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        return message.channel.send({embed: queue})

    }
}