const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ms = require('ms');

module.exports = {
    name: "seek",
    usage: "seek",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "goes to a certain point in the music",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        //command is broken

        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        if(client.queue.get(message.guild.id) == undefined) return message.channel.send('Nothing is playing!')
        client.queue.get(message.guild.id).connection.playStream(ytdl(client.queue.get(message.guild.id).queue[0].url),{
            filter: "audioonly",
            seek: client.queue.get(message.guild.id).connection.dispatcher.time + ms(args[0]),
            volume: client.queue.get(message.guild.id).volume,
            // passes: 1,
            bitrate: 48000
        })
        return message.channel.send(`Sucessfully skipped to ${ms(client.queue.get(message.guild.id).connection.dispatcher.time + parseInt(args[0]), { long: true })}`)
    
    }
}