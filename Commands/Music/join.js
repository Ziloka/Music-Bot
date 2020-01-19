const Discord = require('discord.js');

module.exports = {
    name: "join",
    usage: "join",
    category: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(message.guild.members.get(client.user.id).voiceChannel != undefined) return message.channel.send('Wait your turn!')
        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        message.member.voiceChannel.join()
        return message.channel.send('Successfully joined the voice channel!')

    }
}