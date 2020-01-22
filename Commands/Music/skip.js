module.exports = {
    name: "skip",
    usage: "skip",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "skips the current song",
    argRequirements: args => !!args.length,
    run: async (client , message, args) => {
        
        if(client.queue.has(message.guild.id) == false) return message.channel.send('Nothing is currently playing!')
        client.queue.get(message.guild.id).connection.dispatcher.end()
        return message.channel.send('Skipped the current song!')

    }
}