const Discord = require('discord.js');
const util = require('util');
const fetch = require('node-fetch');
const {developers} = require('./../../index.js');

module.exports = {
    name: "eval",
    usage: "eval <code>",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

    if(developers.find(ID => ID == message.author.id) == undefined) return;

    try{
        let evaluateThis = args.join(' ');
    let evaluation = util.inspect(eval(evaluateThis))

    try{
    let evaled = new Discord.RichEmbed();
    evaled.setTitle('Evaluation')
    evaled.setColor('#CDDC39')
    evaled.addField('Input', `\`\`\`js
${evaluateThis}\`\`\``)
    evaled.addField('Output', `\`\`\`js
${evaluation}\`\`\``)
    evaled.addField('Type', `\`\`\`js
${typeof evaluation}\`\`\``)
    evaled.setFooter(`Evaluated by ${message.author.username}`, message.author.displayAvatarURL)
    return message.channel.send({embed: evaled})
    }catch(e){
        if(e.message == "RichEmbed field values may not exceed 1024 characters."){
            let options = {
                url: "https://hasteb.in",
                extension: "js"
            }
            let res = await fetch(`${options.url}/documents`, {
                method: "POST",
                body: evaluation.slice(8),
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