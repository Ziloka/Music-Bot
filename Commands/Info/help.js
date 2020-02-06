const Discord = require('discord.js');
const {developers} = require('./../../bot.js');

module.exports = {
    name: "help",
    usage: "help",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "Shows info about the commands",
    argRequirements: args => false,
    run: async (client, message, args, matchedPrefix) => {

        if(args[0] == undefined){
            if(client.developers.find(ID => ID == message.author.id) == undefined) client.categories = client.categories.sort(function(category){category,category}).filter(category => category.toLowerCase() != "developer") 
            let helpEmbed = new Discord.RichEmbed()
            helpEmbed.setTitle('Command Categories')
            helpEmbed.setColor('RANDOM')
            helpEmbed.setDescription(`${client.categories.map(category => category).join('\n')}\nType \`${matchedPrefix}help <category>\`to see the commands that category has`)
            helpEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            return message.channel.send({embed: helpEmbed})
        } else if(args[0] != undefined){
            if(client.categories.find(category => category.toLowerCase() == args[0].toLowerCase()) != undefined){
            if(client.developers.find(ID => ID == message.author.id) == undefined) return;
            // use this if you are using a normal map
            //Array.from(client.commands.values()).filter(category => category.category != undefined && category.category.toLowerCase() == args[0].toLowerCase())
            let commands = client.commands.filter(category => category.category != undefined && category.category.toLowerCase() == args[0].toLowerCase())
            let categoryEmbed = new Discord.RichEmbed()
            categoryEmbed.setTitle(`${args[0].toProperCase()} Commands`)
            categoryEmbed.setColor('RANDOM')
            categoryEmbed.setDescription(commands.map(cmd => `\`${cmd.name}\``).join(', '))
            categoryEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            return message.channel.send({embed: categoryEmbed})
            } else if(client.commands.find(cmd => cmd.name == args[0].toLowerCase()) != undefined){
                if(client.commands.get(cmd => cmd.name == args[0].toLowerCase()).category == "Developer" && client.developers.find(ID => ID == message.author.id) == undefined) return;
                let command = client.commands.get(args[0])
                let commandsEmbed = new Discord.RichEmbed()
                commandsEmbed.setTitle(`${args[0].toProperCase()}`)
                commandsEmbed.setDescription(`Name: ${command.name}\nDescription: ${command.description}`)
                return message.channel.send({embed: commandsEmbed})
            }
            
        } else {
            return;
        }

    }
}