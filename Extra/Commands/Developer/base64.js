const Discord = require('discord.js');
const Base64 = require('js-base64').Base64;
const path = require('path')

module.exports = {
    name: "base64",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "encodes or decodes whatever is given",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(client.developers.find(ID => ID == message.author.id) == undefined) return;

        let choices = ['encode', 'decode']
        if(choices.find(name => name == args[0]) == undefined) return message.channel.send(`The valid categories are:\n${choices.join('\n')}`)
        let choice = choices.find(name => name == args[0])
        if(args[1].length == 0) return message.channel.send(`Cannot ${choice} nothing!`)
        if(Base64.extendString){
            Base64.extendString()
            message.delete();
        if(choice == 'encode'){
            let Encode = new Discord.RichEmbed()
            Encode.setTitle('Base 64')
            Encode.addField(`Encode`, args.slice(1).join(' ').toBase64())
            return message.channel.send({embed: Encode})
        } else if(choice == 'decode'){
            let Decode = new Discord.RichEmbed()
            Decode.setTitle('Base 64')
            Decode.addField(`Decode`, args.slice(1).join(' ').fromBase64())
            return message.channel.send({embed: Decode})
        } else {
            return;
        }
        } else {
            return;
        }


    }
}