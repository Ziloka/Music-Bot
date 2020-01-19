const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const yt = require("yt-search");

module.exports = {
  name: "search",
  usage: "search <song name or url>",
  blackListed: true,
  argRequirements: args => !args.length,
  run: async (client, message, args) => {
    let options = {
      query: args.join(" "),
      pageStart: 1,
      pageEnd: 3
    };

    yt(options, async function(err, res) {
      if (err) {
        console.log(err);
        return message.channel.send("Sorry something went wrong!");
      } else {
        let videos = res.videos.slice(0, 10);
        let videosSelectionEmbed = new Discord.RichEmbed();
        videosSelectionEmbed.setTitle(`Results for ${options.query}`);
        videosSelectionEmbed.setDescription(`${videos.map((video, index) => `${index + 1} - [${video.title}](https://youtube.com/${ video.url})`).join("\n")}`);
        videosSelectionEmbed.addField(
          `You have 20 seconds to choose a video!`,
          `Type cancel to cancel the video selection!`
        );
        videosSelectionEmbed.setFooter(
          `Requested by: ${message.author.username}`,
          message.author.displayAvatarURL
        );
        message.channel.send({ embed: videosSelectionEmbed });

        try {
          let response = await message.channel.awaitMessages(
            message2 =>
              message2.author.id == message.author.id &&
              /10|[1-9]|cancel/.test(message2.content),
            {
              maxMatches: 1,
              time: 20000,
              errors: ["time"]
            }
          );

          let videoNum = parseInt(response.first().content);
          let wantedVideo = res.videos[videoNum - 1];
          let info = await ytdl.getInfo(wantedVideo.url);
          let data = client.queue.get(message.guild.id);

          if (!data) {
            data = {
              connection: await message.member.voiceChannel.join(),
              voiceChannel: message.member.voiceChannel,
              queue: [],
              guildID: message.guild.id,
              channel: message.channel,
              loopQueue: false,
              loopSong: false,
              playedLoopSong: null,
              playQueueSongs: []
            };
            client.queue.set(message.guild.id, data);
          }

          data.queue.push({
            songTitle: info.title,
            requester: message.author.toString(),
            url: wantedVideo.url,
            voiceChannel: message.member.voiceChannel,
            announceChannel: message.channel
          });

          if (!data.dispatcher) {
            play(client, data, message);
          } else {
            let queueConstruction = {
              songs: []
            };
          }
          if (data.queue.length > 1) {
            let addedToQueue = new Discord.RichEmbed();
            addedToQueue.setTitle("Added to Queue");
            addedToQueue.setDescription(
              `Added: (${data.queue[data.queue.length - 1].songTitle})[${
                data.queue[data.queue.legnth - 1].url
              }] Requested by: ${data.queue[data.queue.length - 1].requester}`
            );
            addedToQueue.setFooter(
              `Requested by ${message.author.username}`,
              message.author.displayAvatarURL
            );
            message.channel.send({ embed: addedToQueue });
          }

          client.queue.set(message.guild.id, data);

          let playSong = new Discord.RichEmbed();
          playSong.setDescription(
            `Queued ${info.title} from ${message.author.username}#${message.author.discriminator}`
          );
        } catch (e) {
          console.log(e);
          return message.channel.send("Canceled video selection");
        }
      }
    });
  }
};

async function play(client, data, message) {
  let playing = new Discord.RichEmbed();
  playing.setTitle("Now playing");
  playing.setDescription(
    `Now playing [${data.queue[0].songTitle}](${data.queue[0].url}) requested by ${data.queue[0].requester.tag}`
  );
  playing.setFooter(
    `Requested by ${data.queue[0].requester.username}`,
    data.queue[0].requester.displayAvatarURL
  );

  data.channel.send({ embed: playing });
  data.dispatcher = await data.connection.playStream(
    ytdl(data.queue[0].url, { filter: "audioonly" })
  );
  data.dispatcher.guildID = data.guildID;
  data.dispatcher.on("end", () => {
    finish(client, data, message);
  });
}

async function finish(client, data, message) {
  data.queue.shift();
  if (data.queue.length > 0) {
    client.queue.set(data.guildID, data);
    play(client, data, message);
  } else {
    try {
      message.guild.channels.get(data.guildID).me.voiceChannel.leave();
    } catch (e) {
      return;
    }
  }
}
