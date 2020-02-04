const Discord = require('discord.js');

module.exports = {
    name: "reload",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "reloads the command",
    argRequirements: args => false,
    run: async (client, message, args) => {

        if(client.developers.find(ID => ID == message.author.id) == undefined) return;
        if(args.length == 1) load(client, message, args[0])
        else load(client, message);

    }
}

let load = (client, message, command) => {

    let commands = Object.values(client.commands)
    if(command){
        let commandPath = client.commands.get(command).path
        delete require.cache[require.resolve(commandPath)]
        client.commands.delete(command)
        client.commands.set(command, require(commandPath))
        return message.channel.send(`Reloaded ${command}!`)
    } else {
        commands.forEach(command => {
            if(command.match(/\.js$/)){
                delete require.cache[require.resolve(command.path)]
                client.commands.delete(command.name)
                client.commands.set(command.name, require(command.path))
            }
        })
        return message.channel.send('Reloaded all of the commands!')
    }

}