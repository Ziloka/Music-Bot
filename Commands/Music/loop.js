const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "loop",
    usage: "loop",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "loops the song or queue",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(message.member.voiceChannel == undefined) return message.channel.send(`Join a voice channel to use this command!`)
        if(client.queue.get(message.guild.id) == undefined) return message.channel.send(`Nothing is playing!`)
        if(args[0] == undefined) return message.channel.send(`Choose either \`song\` or \`queue\`!`)
        let validAnswers = ['song', 'queue']
        if(validAnswers.some(answer => answer == args[0].toLowerCase()) == false) return message.channel.send(`Choose either \`song\` or \`queue\`!`)
        let songs = [...client.queue.get(message.guild.id).songs]
        if(args[0].toLowerCase() == "song"){
            if(client.queue.get(message.guild.id).loopSong == false && client.queue.get(message.guild.id).loopQueue == false){
                client.queue.get(message.guild.id).loopSong = true
                client.queue.get(message.guild.id).loopThisSong = client.queue.get(message.guild.id).songs[0]
                client.queue.get(message.guild.id).theRestOfLoopSongs = client.queue.get(message.guild.id).songs.slice(1)
                let song = client.queue.get(message.guild.id).songs[0]
                return message.channel.send(`Looping ${song.info.title} by ${song.info.author} forever`)
            } else if(client.queue.get(message.guild.id).loopSong == true){
                client.queue.get(message.guild.id).loopSong = false
                client.queue.get(message.guild.id).loopThisSong = null
                client.queue.get(message.guild.id).songs = client.queue.get(message.guild.id).theRestOfLoopSongs
                return message.channel.send(`Stopped looping current song`)
            } else {
                return message.channel.send('You cannot loop the song the and queue at the same time!')
            }
        } else if(args[0].toLowerCase() == "queue"){
            if(client.queue.get(message.guild.id).loopQueue == false && client.queue.get(message.guild.id).loopSong == false){
                client.queue.get(message.guild.id).loopQueue = true
                client.queue.get(message.guild.id).loopQueueSongs = songs
                return message.channel.send('Now looping entire queue')
            } else if(client.queue.get(message.guild.id).loopQueue == true){
                client.queue.get(message.guild.id).loopQueue = false
                client.queue.get(message.guild.id).loopQueueSongs = null
                return message.channel.send(`Stopped looping entire queue`)
            } else {
                return message.channel.send('You cannot loop the song the and queue at the same time!')
            }
        }

    }
}