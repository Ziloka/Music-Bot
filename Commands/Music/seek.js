const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');

module.exports = {
    name: "seek",
    usage: "seek <forward or backward> <time>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "seeks to a certain point into a song",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        let player = client.player.get(message.guild.id)
        if(!player) return message.channel.send('No player has been found')
        let validOptions = ['forward','backward']
        if(args[0] == undefined) return message.channel.send(`Choose a option!`)
        if(validOptions.some(o => o == args[0].toLowerCase()) == false) return message.channel.send('Choose a valid Option!')
        if(args[1] == undefined) return message.channel.send(`Specify a time!`)
        let time = ms(args[1])
        if(args[0].toLowerCase() == "forward"){
            if(client.queue.get(message.guild.id).songs[0].info.length < time+client.player.get(message.guild.id).state.position) return message.channel.send('That is skipping the song if you want to do that use the skip command, otherwise choose a lower seek length')
            client.player.get(message.guild.id).seek(time)
            return message.channel.send(`Sucessfully seeked to ${moment.utc(client.player.get(message.guild.id).state.position).format('H:mm:ss')}`)
        } else if(args[0].toLowerCase() == "backward"){
            if((client.player.get(message.guild.id).state.position-time) < 0) return message.channel.send('That is going back farther than the begining of the song, please choose a lower seek length')
            client.player.get(message.guild.id).seek(-time)
            return message.channel.send(`Sucessfully seeked to ${moment.utc(client.player.get(message.guild.id).state.position).format('H:mm:ss')}`)
        } else {
            return;
        }

    }
}