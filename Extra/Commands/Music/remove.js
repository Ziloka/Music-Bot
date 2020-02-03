const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ms = require('ms');

module.exports = {
    name: "remove",
    usage: "remove <ID>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "Removes a song from the queue",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        if(client.queue.get(message.guild.id).dispatcher == undefined) return message.channel.send('Nothing is playing!')
        if(isNaN(args[0])) return message.channel.send('Please specify a number!')
        if(client.queue.get(message.guild.id).length < parseInt(args[0]) || 0 > parseInt(args[0])) return message.channel.send('That is a invalid number!')
        let num = parseInt(args[0]-1)
        let removedSong = client.queue.get(message.guild.id).queue[num]
        client.queue.get(message.guild.id).queue.splice(num,1)
        if(args[0] == 1) client.queue.get(message.guild.id).dispatcher.emit('end')
        return message.channel.send(`Sucessfully removed ${removedSong.songTitle}`)
    
    }
}