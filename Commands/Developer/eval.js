const Discord = require('discord.js');
const util = require('util');
const fetch = require('node-fetch');
const {developers} = require('../../bot.js');

module.exports = {
    name: "eval",
    usage: "eval <code>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "evaulates stuff in javascript",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

    if(developers.find(ID => ID == message.author.id) == undefined) return;

    try{
        let evaluateThis = args.join(' ')
        let evaluation = await util.inspect(eval(evaluateThis))
        let hrStart = process.hrtime()
        let hrDiff = process.hrtime(hrStart)

        try{
            // (async () => {
            // })()
            // Use this in your code to do stuff asynchronously!
            let evaled = new Discord.RichEmbed();
            evaled.setTitle('Evaluation')
            evaled.setColor('#CDDC39')
            evaled.addField('Input', `\`\`\`js\n${evaluateThis}\`\`\``)
            evaled.addField('Output', `\`\`\`js\n${evaluation}\`\`\``)
            evaled.addField('Type', `\`\`\`js\n${typeof evaluation}\`\`\``)
            evaled.addField('Time it takes to evaulate code', `${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1]/1000000}ms`)
            evaled.setFooter(`Evaluated by ${message.author.username}`, message.author.displayAvatarURL)
            // message.channel.send(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s`:''}${hrDiff[1]/1000000}`)
            return message.channel.send({embed: evaled})
    }catch(e){
        if(e.message == "RichEmbed field values may not exceed 1024 characters."){
            let options = {
                url: "https://hasteb.in",
                extension: "js"
            }
            let res = await fetch(`${options.url}/documents`, {
                method: "POST",
                body: evaluation,
                headers: { "Content-Type": "text/plain" }
            })
            if(!res.ok) message.channel.send(res.statusText)
            res.json().then(newRes => {
                let over1024Characters = new Discord.RichEmbed()
                over1024Characters.setTitle('Output')
                over1024Characters.setDescription(`The output was longer than 1024 characters so I have placed the evaluation in a text storage site:\n ${`https://hasteb.in/${newRes.key}.${options.extension}`}`)
                over1024Characters.setFooter(`Evaluated by ${message.author.username}`, message.author.displayAvatarURL)
                return message.channel.send({embed: over1024Characters})
                
            })
            
        } else {
            return message.channel.send(e.message)
        }
    }
    }catch(e){
        return message.channel.send(e.message)
    }

    }
}