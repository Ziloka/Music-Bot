const Discord = require('discord.js');

module.exports = {
    name: "disconnect",
    usage: "disconnect",
    category: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        message.member.voiceChannel.leave()
        return message.channel.send('Successfully left the voice channel!')

    }
}