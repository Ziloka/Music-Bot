module.exports = (client) => {

    let escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    client.on('message', async message => {
    
        if(message.author.bot) return;
        let prefix = client.prefix
        let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`,`i`,`g`);
        if(!prefixRegex.test(message.content)) return;
    
        let [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
    
        let commandfile = client.commands.get(command)
        if(!commandfile) commandfile = client.aliases.get(command)
        if(commandfile == undefined) return;
        if(commandfile.description.toLowerCase() == "coming soon!" && client.developers.find(ID => ID == message.author.id) == undefined) return message.channel.send('This command is coming soon!')
        if(commandfile.argRequirements(args) == true) return message.channel.send(`Correct usage is **${prefix}${commandfile.usage}**`)
        if(commandfile) commandfile.run(client, message, args, matchedPrefix)
    
    })

}