const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "skip",
    usage: "skip",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "skips the current song",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        let player = client.player.get(message.guild.id)
        if(!player) return message.channel.send('No player has been found')
        player.emit('end', data = {
            reason: "The skip command has been used!"
        })
        return message.channel.send('Skipped the current song')

    }
}