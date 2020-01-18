const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const yt = require("yt-search");

module.exports = {
  name: "play",
  usage: "play <song name or url>",
  argRequirements: args => !args.length,
  run: async (client, message, args) => {

    if(message.member.voiceChannel == undefined) return message.channel.send("Join a voice channel to use this command!");
    if(args.join(' ') == undefined) return message.channel.send('Use a keyword or a url!');

    if (args.join(" ").match(/^https?:\/\/(www.youtube.com|youtube.com)/)) {
      if(ytdl.validateURL(args.join(' ')) == false) return message.channel.send('That is not a valid URL');
      let url = args.join(' ');
      let data = client.queue.get(message.guild.id)
      let info = await ytdl.getInfo(url)
      return addToQueue(client, message, args, info, data, url)
    } else {
      return searchYT(client, message, args)
    }

  }
};

async function searchYT(client, message, args){

  yt(args.join(" "), async (err, res) => {
    if (err)
      return message.channel.send("An error occurred, please try again!");
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
  data.dispatcher.setVolume(0.1)
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
    console.log(`${data.queue[0].songTitle}: is song looped?\n${data.loopSong == false}`)
    if(data.loopSong == false){
      console.log(data.queue.length)
      if (data.queue.length > 0){
        data.queue.shift();
        console.log(data.queue)
        client.queue.set(data.guildID, data);
        play(client, data, message);
      } else {
        try {
          console.log('gets here')
          message.guild.channels.get(data.guildID).me.voiceChannel.leave();
          client.queue.delete(message.guild.id);
        } catch (e) {
          return;
        }
      }
    } else {
      play(client, data, message)
    }
  } else if(data.loopQueue == true){
    // has issue here
    let currentSongs = data.playQueueSongs
    data.queue.shift()
    if(data.queue.length == 0) data.queue.push(currentSongs);
    //undefined
    data.queue = data.queue[0]
    play(client, data, message)
  }
  
}
