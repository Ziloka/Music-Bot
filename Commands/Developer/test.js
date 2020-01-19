const Discord = require('discord.js');
const ytdl = require('ytdl-core');
let map = new Map();

module.exports = {
    name:"test",
    usage: "test",
    category: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {
        
       try{
            client.queue.get(message.guild.id).dispatcher.emit('end')
       }catch(e){
           return message.channel.send(e.message)
       }

    }
}