const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "pause",
    usage: "pause",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "pauses the queue",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

       let player = client.player.get(message.guild.id)
       if(!player) return message.channel.send('No player has been found')
       await player.pause(true);
       return message.channel.send('Paused the music')

    }
}