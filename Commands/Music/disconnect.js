const Discord = require('discord.js');

module.exports = {
    name: "disconnect",
    usage: "disconnect",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "disconnects from the voice channel",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        message.member.voiceChannel.leave()
        return message.channel.send('Successfully left the voice channel!')

    }
}