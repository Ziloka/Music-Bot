const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
    name: "playlist",
    usage: "playlist <private or public> <playlist name>",
    category: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => !args.length,
    run: async (client, message, args) => {
    
        if(args[0] == "create"){
            let privateOrNot = ['public', 'private']
            if(client.queue.has(message.guild.id) == false) return message.channel.send('Nothing is currently playing!\n When something is playing and you execute this command the queue will be placed')
            let isPrivate = privateOrNot.find(word => word == args[0])
            if(isPrivate == undefined) return message.channel.send(`That is a invalid category, choose ${privateOrNot.join(' or ')}`)
            if(args[1] == undefined) return message.channel.send('You can\'t name the playlist Nothing!')
            let db = new sqlite3.Database('./music.db', (err) => {
                if(err) console.error(err.message)
            })
            db.run(`INSERT INTO playlist(${isPrivate}_${message.author.id}_${args[0]}) VALUES(${client.queue.get(message.guild.id).queue})`,['C'], function(err){
                if(err) return console.error(err.message)
                console.log(`A row has been inserted with the row ID ${this.lastID}`)
            })
            db.close()
        } else if(args[0] == 'delete'){

        }

    }
}