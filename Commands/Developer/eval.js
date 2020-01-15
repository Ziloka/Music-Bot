const Discord = require('discord.js');

module.exports = {
    name: "eval",
    usage: "eval <code>",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

    let evaluateThis = args.join(' ');
    let evaulation = eval(evaluateThis);
    let evaled = new Discord.RichEmbed();
    evaled.setTitle('Evaluation')
    evaled.addField('Input', `\`\`\`js
${evaluateThis}\`\`\``)
    evaled.addField('Output', `\`\`\`js
${evaulation}\`\`\``)
    evaled.addField('Type', `\`\`\`js
${typeof evaulation}\`\`\``)
    evaled.setFooter(`Evaluated by ${message.author.username}`, message.author.displayAvatarURL)
    return message.channel.send({embed: evaled})

    }
}