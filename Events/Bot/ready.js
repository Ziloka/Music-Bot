const { Node } = require('lavalink');
const chalk = require('chalk');
let ctx = new chalk.Instance({leveL : 3})

module.exports = (client) => {
    client.on('ready', async () => {
        console.log(ctx.red.underline.bold(`${client.user.username} is online!`))
        // console.log(ctx.bgMagenta.red.underline.bold(`${client.user.username} is online!`)) 
        
        client.voice = new Node({
            password: "youshallnotpass",
            userID: client.user.id,
        })
    })
}