const Discord = require('discord.js');
const util = require('util');
const fetch = require('node-fetch');
const childProcess = require('child_process');

module.exports = {
    name: "exec",
    usage: "exec <code>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "evaulates stuff in javascript",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

    if(client.developers.find(ID => ID == message.author.id) == undefined) return;
    if(args.join(' ').length == 0) return message.channel.send('Cannot execute nothing!')

        childProcess.exec(args.join(' '), async (err, stdout, stderr) => {
            return message.channel.send(`\`\`\`bat\n${stderr}${stdout}\`\`\``).catch(async err => {
                if(err.message == "Invalid Form Body\ncontent: Must be 2000 or fewer in length."){
                    let options = {
                        url: "https://hasteb.in",
                        extension: "bat"
                    }
                    let res = await fetch(`${options.url}/documents`, {
                        method: "POST",
                        body: stderr + stdout,
                        headers: { "Content-Type": "text/plain" }
                    })
                    if(!res.ok) message.channel.send(res.statusText)
                    res.json().then(newRes => {
                        let over1024Characters = new Discord.RichEmbed()
                        over1024Characters.setTitle('Output')
                        over1024Characters.setDescription(`The output was longer than 2000 characters so I have placed the evaluation in a text storage site:\n ${`https://hasteb.in/${newRes.key}.${options.extension}`}`)
                        over1024Characters.setFooter(`Evaluated by ${message.author.username}`, message.author.displayAvatarURL)
                        return message.channel.send({embed: over1024Characters})
                    })
                } else {
                    console.log(err)
                }
            })
        })
    }
}