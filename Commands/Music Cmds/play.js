const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const yt = require('yt-search');

module.exports = {
    name: "play",
    usage: "play <song name or url>",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(message.member.voiceChannel == undefined) return message.channel.send('Join a voice channel to use this command!')
        yt(args.join(' '), async (err, res) => {
            if(err) return message.channel.send('An error occurred, please try again!')
            let video = res.videos[0]
            let url = video.url
            let info = await ytdl.getInfo(url);
            let data = client.queue.get(message.guild.id)

            if(data == undefined){
                data = {
                    connection: await message.member.voiceChannel.join(),
                    queue: [],
                    guildID: message.guild.id,
                    channel: message.channel
                }
                client.queue.set(message.guild.id, data)
            }

            data.queue.push({
                songTitle: info.title,
                requester: message.author,
                url: url,
                announceChannel: message.channel
            })

            if(!data.dispatcher){
                play(client, data, message);
            } else {
                message.channel.send(`**Succesfully added:** ${info.title} to the queue, requested from ${message.author.tag}`)
            }
            client.queue.set(message.guild.id, data);

        })

    }
}

async function play(client, data, message){

    let playing = new Discord.RichEmbed()
    playing.setTitle('Now playing')
    playing.setDescription(`Now playing [${data.queue[0].songTitle}](${data.queue[0].url}) requested by ${data.queue[0].requester.tag}`)
    playing.setFooter(`Requested by ${data.queue[0].requester.username}`, data.queue[0].requester.displayAvatarURL)

    data.channel.send({embed: playing})
    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, {filter: "audioonly"}));
    data.dispatcher.guildID = data.guildID;
    data.dispatcher.on('end', () => {
        finish(client, data, message)
    })

}

async function finish(client, data, message){

    data.queue.shift();
    if(data.queue.length > 0){
        client.queue.set(data.guildID, data)
        play(client, data, message)
    } else {
        try{
            message.guild.channels.get(data.guildID).me.voiceChannel.leave()
        }catch(e){
            return;
        }
    }

}