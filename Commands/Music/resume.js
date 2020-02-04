const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "resume",
    usage: "resume",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "resumes the queue",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        let player = client.player.get(message.guild.id)
        if(!player) return message.channel.send('No player has been found')
        await player.pause(false)
        return message.channel.send('Resumed the music')

    }
}