const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "disconnect",
    usage: "disconnect",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "disconnects from the voice channel",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        await client.player.leave(message.guild.id)
        return message.channel.send("Succesfully left the voice channel")

    }
}