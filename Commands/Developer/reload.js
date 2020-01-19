const Discord = require('discord.js');

module.exports = {
    name: "reload",
    client: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => true,
    run: async (client, message, args) => {

        if(args.length > 1) load(client, args[1])
        else load(client);

    }
}

let load = (client, command) => {

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