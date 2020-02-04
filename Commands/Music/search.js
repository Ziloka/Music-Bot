const Discord = require('discord.js');
const { URLSearchParms } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "search",
    usage: "search <keywords>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "resumes the queue",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(!message.guild.members.get(client.user.id).hasPermission("CONNECT", "SPEAK", "VIEW_CHANNEL")) return message.channel.send(`I need the permission \`Connect\` to execute this command!`)
        if(message.member.voiceChannel == undefined) return message.channel.send(`Join a voice channel to use this command!`)
        if(args.join(' ').length == 0) return message.channel.send('Can\'t search for nothing!')
        let track = args.join(' ');
        let songs = await getSongs(client, `ytsearch: ${track}`)
        if(!songs) return message.channel.send(`No songs found. Try again!`)

        let selectionEmbed = new Discord.RichEmbed()
        selectionEmbed.setTitle(`Results for ${args.join(' ')}`)
        selectionEmbed.setDescription(songs.tracks.map((t, i) => `**${i+1}**: ${t.info.title} by ${t.info.author}`).slice(0,10).join('\n'))
        selectionEmbed.addField(`Choose an ID 1-10`,`Type \`cancel\` to cancel the video selection`)
        selectionEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        message.channel.send({embed: selectionEmbed})

        let response = await message.channel.awaitMessages(message2 => message2.author.id == message.author.id && /10|[1-9]|cancel/.test(message2.content),{
            max: 1,
            maxMatches: 1,
            time: 20000,
            errors: ['time']
        })

        let num = parseInt(response.first().content)
        song = songs.tracks[num - 1]

        let player = await client.player.join({
            guild: message.guild.id,
            channel: message.member.voiceChannelID,
            host: client.player.nodes.first().host
        },{
            selfdeaf: true
        })
        if(!player) return message.channel.send('Could not join');

        if(client.queue.get(message.guild.id) == undefined){
            play(client, message, player, song)
        } else {
            if(client.queue.get(message.guild.id).loopSong == true){
                return message.channel.send('You cannot add a song while you are looping this song!')
            } else {
                client.queue.get(message.guild.id).songs.push(song)
                return message.channel.send(`${song.info.title} by ${song.info.author} has been added to the queue!`)
            }
        }

    }
}

async function getSongs(client, search){
    let node = client.player.nodes.first();
    let params = new URLSearchParams();
    params.append("identifier", search)
    let res = await fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, {
        headers : {
            Authorization: node.password
        }
    })
    let data = await res.json()
    return data
}

async function play(client, message, player, song){

    if(client.queue.get(message.guild.id) == undefined){
        let queueConstruct = {
            loopSong: false,
            loopThisSong: null,
            theRestOfLoopSongs: null,
            loopQueue: false,
            loopQueueSongs: null,
            songs: []
        }
        queueConstruct.songs.push(song)
        client.queue.set(message.guild.id, queueConstruct)
    }
    player.play(client.queue.get(message.guild.id).songs[0].track);
    player.once("error", console.error)
    player.once('end', async (data) => {
        if(data.reason == "REPLACED") return;
        message.channel.send("Song has ended")
        client.queue.get(message.guild.id).songs.shift()
        finish(client, message, player, song, data)
    })
    return message.channel.send(`Now playing: **${song.info.title}** by ${song.info.author}`)
    
}

async function finish(client, message, player, song, data){

    if(client.queue.get(message.guild.id).loopQueue == false && client.queue.get(message.guild.id).loopSong == false){
        if(client.queue.get(message.guild.id).songs.length == 0){
            await client.player.leave(message.guild.id)
            client.queue.delete(message.guild.id)
        } else {
            play(client, message, player, client.queue.get(message.guild.id).songs[0])
        }
    } else if(client.queue.get(message.guild.id).loopQueue == true){
        if(client.queue.get(message.guild.id).songs.length == 0) client.queue.get(message.guild.id).songs = [client.queue.get(message.guild.id).loopQueueSongs[0]]
        play(client, message, player, client.queue.get(message.guild.id).songs[0])
    } else if(client.queue.get(message.guild.id).loopSong == true){
        client.queue.get(message.guild.id).songs = [client.queue.get(message.guild.id).loopThisSong]
        play(client, message, player, client.queue.get(message.guild.id).songs[0])
    } else {
        return;
    }

}