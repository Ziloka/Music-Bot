const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "remove",
    usage: "remove <song ID>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "removes a song from the queue",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        let player = client.player.get(message.guild.id)
        if(!player) return message.channel.send('No player has been found')
        if(args[0].length == 0) return message.channel.send('Choose a song ID')
        if(isNaN(args[0])) return message.channel.send('Choose a song ID')
        if(client.queue.get(message.guild.id).songs.length + 1 < parseInt(args[0]) || parseInt(args[0]) < 0) return message.channel.send('Choose a valid song ID')
        let num = parseInt(args[0])
        console.log(client.queue.get(message.guild.id).songs.length)
        console.log(num-1)
        let song = client.queue.get(message.guild.id).songs[num-1]
        client.queue.get(message.guild.id).songs.splice(num, 1)
        return message.channel.send(`Sucessfully removed ${song.info.title} by ${song.info.author}`)

    }
}