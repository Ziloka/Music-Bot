const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const {developers} = require('../../bot.js');
let map = new Map();

module.exports = {
    name:"test",
    usage: "test",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {
        
        if(developers.find(ID => ID == message.author.id) == undefined) return;
       try{
            client.queue.get(message.guild.id).dispatcher.emit('end')
       }catch(e){
           return message.channel.send(e.message)
       }

    }
}