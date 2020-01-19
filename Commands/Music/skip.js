module.exports = {
    name: "skip",
    usage: "skip",
    category: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => !!args.length,
    run: async (client , message, args) => {
        
        if(client.queue.has(message.guild.id) == false) return message.channel.send('Nothing is currently playing!')
        client.queue.get(message.guild.id).connection.dispatcher.end()
        return message.channel.send('Skipped the current song!')

    }
}