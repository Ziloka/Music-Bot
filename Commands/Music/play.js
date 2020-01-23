const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const yt = require("yt-search");

module.exports = {
  name: "play",
  usage: "play <song name or url>",
  aliases: ['search'],
  category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
  description: "plays a song from youtube",
  argRequirements: args => !args.length,
  run: async (client, message, args, matchedPrefix) => {

    if(message.member.voiceChannel == undefined) return message.channel.send("Join a voice channel to use this command!");
    if(args.join(' ') == undefined) return message.channel.send('Use a keyword or a url!');

    let someArgs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    let command = someArgs.shift().toLowerCase();

    if(command == "search"){
      return searchMultipleYTVideos(client, message, args)
    } else {
      if (args.join(" ").match(/^https?:\/\/(www.youtube.com|youtube.com)/)) {
        if(ytdl.validateURL(args.join(' ')) == false) return message.channel.send('That is not a valid URL');
        let url = args.join(' ');
        let data = client.queue.get(message.guild.id)
        let info = await ytdl.getInfo(url).catch(e => {})
        if(info == undefined) return message.channel.send('I cannot play this link! choose another one!')
        return addToQueue(client, message, args, info, data, url)
      } else {
        return searchYTOnce(client, message, args)
      }
    }

  }
};

async function searchMultipleYTVideos(client, message, args){
  
  yt(args.join(' '), async (err, res) => {
    if(err) return message.channel.send('An error occurred, please try again!')
    try{
      let videos = res.videos.slice(0,10)
    let videoEmbed = new Discord.RichEmbed()
    videoEmbed.setTitle(`Results for ${args.join(' ')}`)
    videoEmbed.setDescription(`${videos.map((song, index) => `${index+1}: [${song.title}](https://youtube.com/${song.url})`).join('\n')}`)
    videoEmbed.addField('You have 20 seconds to choose a song!', 'Type `cancel` to cancel the song selection!')
    videoEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
    message.channel.send({embed: videoEmbed})

    let response = await message.channel.awaitMessages(message2 => message2.author === message.author && /10|[0-9]|cancel/.test(message2.content), {
      time: 20000,
      max: 1,
      maxProcessed: 1,
      errors: ['time']
    })

    let videoNum = parseInt(response.first().content);
    let wantedVideo = res.videos[videoNum - 1];
    let url = wantedVideo.url
    let info = await ytdl.getInfo(wantedVideo.url);
    let data = client.queue.get(message.guild.id)
    addToQueue(client, message, args, info, data, url)
    }catch(e){
      console.log(e)
      message.channel.send('Sorry something went wrong')
    }
  })

}

async function searchYTOnce(client, message, args){

  yt(args.join(" "), async (err, res) => {
    if (err) return message.channel.send("An error occurred, please try again!");
    let video = res.videos[0];
    let url = video.url;
    let info = await ytdl.getInfo(url);
    let data = client.queue.get(message.guild.id); 
    addToQueue(client, message, args, info, data, url)
  });

}

async function addToQueue(client, message, args, info, data, url){

  if (data == undefined) {
    data = {
      connection: await message.member.voiceChannel.join(),
      voiceChannel: message.member.voiceChannel,
      queue: [],
      guildID: message.guild.id,
      channel: message.channel,
      loopQueue: false,
      loopSong: false,
      playedLoopedSong: null,
      playQueueSongs: []
    };
    client.queue.set(message.guild.id, data);
  }

  data.queue.push({
    songTitle: Discord.Util.escapeMarkdown(info.title),
    requester: message.author,
    url: url,
    announceChannel: message.channel
  });

  if (!data.dispatcher) {
    play(client, data, message);
  } else {
    message.channel.send(
      `**Succesfully added:** ${info.title} to the queue, Requested from ${message.author.tag}`
    );
  }
  client.queue.set(message.guild.id, data);

}

async function play(client, data, message) {
  try{
    let playing = new Discord.RichEmbed();
  playing.setTitle(`Now playing`);
  playing.setDescription(
    `Now playing [${data.queue[0].songTitle}](${data.queue[0].url}) Requested by ${data.queue[0].requester.tag}`
  );
  playing.setFooter(
    `Requested by ${data.queue[0].requester.username}`,
    data.queue[0].requester.displayAvatarURL
  );

  data.channel.send({ embed: playing });
  data.dispatcher = await data.connection.playStream(
    ytdl(data.queue[0].url, { filter: "audioonly" })
  );
  data.dispatcher.setVolume(1)
  data.dispatcher.guildID = data.guildID;
  data.dispatcher.on("end", () => {
    finish(client, data, message);
  });
  }catch(e){
    console.log(e)
    return;
  }
}

async function finish(client, data, message) {

  if(data.loopQueue == false){
    if(data.loopSong == false){
      if (data.queue.length > 1){
        data.queue.shift();
        client.queue.set(data.guildID, data);
        play(client, data, message);
      } else {
        try {
          message.guild.channels.get(data.voiceChannel.id).leave();
          client.queue.delete(message.guild.id);
        } catch (e) {
          console.log(e)
          return;
        }
      }
    } else {
      play(client, data, message)
    }
  } else if(data.loopQueue == true){
    let currentSongs = data.playQueueSongs
    data.queue.shift()
    if(data.queue.length == 0) data.queue.push(currentSongs);
    data.queue = data.queue[0]
    play(client, data, message)
  }
  
}