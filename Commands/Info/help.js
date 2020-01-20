const Discord = require('discord.js');

module.exports = {
    name: "help",
    usage: "help",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    argRequirements: args => !args.length,
    run: async (client, message, args, matchedPrefix) => {

        if(client.categories.find(category => category.toLowerCase() == args[0].toLowerCase()) != undefined){
            // use this if you are using a normal map
            //Array.from(client.commands.values()).filter(category => category.category != undefined && category.category.toLowerCase() == args[0].toLowerCase())
            let commands = client.commands.filter(category => category.category != undefined && category.category.toLowerCase() == args[0].toLowerCase())
            let commandsEmbed = new Discord.RichEmbed()
            commandsEmbed.setTitle(`${args[0]} Commands`)
            commandsEmbed.setDescription(commands.map(cmd => `\`${cmd.name}\``).join(', '))
            commandsEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            return message.channel.send({embed: commandsEmbed})
        } else {
            let helpEmbed = new Discord.RichEmbed()
            helpEmbed.setTitle('Command Categories')
            helpEmbed.setDescription(client.categories.map(category => category).join('\n'))
            helpEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            return message.channel.send({embed: helpEmbed})
        }

    }
}