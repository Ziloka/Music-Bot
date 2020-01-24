const Discord = require('discord.js');
const Neko = require('neko-love.js');

module.exports = {
    name: "neko",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "gives a neko",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

       Neko("neko").then(url => {
           let attachment = new Discord.Attachment(url)
           let nekoEmbed = new Discord.RichEmbed()
           nekoEmbed.setTitle('Here is your neko!')
           nekoEmbed.setImage(attachment)
           return message.channel.send({embed: nekoEmbed})
       })

    }
}