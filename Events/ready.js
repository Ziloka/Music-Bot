const { PlayerManager } = require('discord.js-lavalink');
const chalk = require('chalk');
let ctx = new chalk.Instance({leveL : 3})

module.exports = (client) => {
    client.on('ready', async () => {
        console.log(ctx.red.underline.bold(`${client.user.username} is online!`))
        // console.log(ctx.bgMagenta.red.underline.bold(`${client.user.username} is online!`)) 
        
        client.player = new PlayerManager(client, client.config.nodes,{
            user: client.user.id,
            shards: 1
        });
    })
}