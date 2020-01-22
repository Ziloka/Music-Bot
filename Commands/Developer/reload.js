const Discord = require('discord.js');
const {developers} = require('./../../bot.js');

module.exports = {
    name: "reload",
    client: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "reloads the command",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        if(args.length > 1) load(client, args[1])
        else load(client);

    }
}

let load = (client, command) => {

    if(developers.find(ID => ID == message.author.id) == undefined) return;

    let commands = client.commands.values()
    if(command){
        delete require.cache[require.resolve(command.path)]
        client.commands.set(command.name, require(command.path))
    } else {
        commands.forEach(command => {
            if(command.match(/\.js$/)){
                delete require.cache[require.resolve(command.path)]
                client.commands.set(command.name, require(command.path))
            }
        })
    }

}