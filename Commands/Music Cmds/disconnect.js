const Discord = require('discord.js');

module.exports = {
    name: "disconnect",
    usage: "disconnect",
    argsRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(message.guild.members.get(client.user.id).voiceChannel != undefined) return message.channel.send('Wait your turn!')
        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        message.member.voiceChannel.leave()
        return message.channel.send('Successfully left the voice channel!')

    }
}