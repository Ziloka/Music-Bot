const Discord = require('discord.js');

module.exports = {
    name: "help",
    usage: "help",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    argRequirements: args => !!args.length,
    run: async (client, message, args, matchedPrefix) => {

        if(client.categories.find(category => category == args[0]) != undefined){
            let categoryEmbed = new Discord.RichEmbed()
            categoryEmbed.setTitle(`${args[0]} Commands`)
            let commands = client.commands.values().filter(category => category.category(client) == args[0])
        } else {
            let helpEmbed = new Discord.RichEmbed()
            helpEmbed.setTitle('Command Categories')
            client.categories.forEach(category => {
                helpEmbed.addField(category, `${matchedPrefix}${category}`)
            })
            helpEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            return message.channel.send({embed: helpEmbed})
        }

    }
}