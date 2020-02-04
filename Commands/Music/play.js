const Discord = require('discord.js');
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

module.exports = {
    name: "play",
    usage: "play",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "plays the most relative song on youtube",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(!message.guild.members.get(client.user.id).hasPermission("CONNECT", "SPEAK", "VIEW_CHANNEL")) return message.channel.send(`I need the permission \`Connect\` to execute this command!`)
        if(message.member.voiceChannel == undefined) return message.channel.send(`Join a voice channel to use this command!`)
        let track = args.join(' ');
        let [song] = await getSongs(client, `ytsearch: ${track}`)
        if(!song) return message.channel.send(`No songs found. Try again!`)
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

function getSongs(client, search){
    let node = client.player.nodes.first();
    let params = new URLSearchParams();
    params.append("identifier", search);
    return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`,
     { headers: {
          Authorization: node.password 
        } 
    }).then(res => res.json()).then(data => data.tracks).catch(err => {
        console.error(err);
        return null;
    });
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