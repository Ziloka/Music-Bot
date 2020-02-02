const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    name:"end",
    usage: "end",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "test command",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {
        
        if(client.developers.find(ID => ID == message.author.id) == undefined) return;
       try{
            client.queue.get(message.guild.id).dispatcher.emit('end')
       }catch(e){
           return message.channel.send(e.message)
       }

    }
}