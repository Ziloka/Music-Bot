const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
    name: "playlist",
    usage: "playlist <create or delete> <private or public> <playlist name>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "Coming Soon!",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {
    
        if(args[0] == "create"){
            let privateOrNot = ['public', 'private']
            let songs = (client.queue.has(message.guild.id) == true) ? client.queue.get(message.guild.id).queue : null
            let isPrivate = privateOrNot.find(word => word.toLowerCase() == args[1].toLowerCase())
            if(isPrivate == undefined) return message.channel.send(`That is a invalid category, choose ${privateOrNot.join(' or ')}`)
            if(args[2] == undefined) return message.channel.send('You can\'t name the playlist Nothing!')
            let db = new sqlite3.Database('./music.db', (err) => {
                if(err) console.error(err.message)
            })
            db.run(`INSERT INTO playlist(${isPrivate}_${message.author.id}_${args[1]}_${args[2]}) VALUES(${songs})`,['C'], function(err){
                if(err) return console.error(err.message)
                console.log(`A row has been inserted with the row ID ${this.lastID}`)
            })
            db.close()
        } else if(args[0] == 'delete'){

        } else if(args[0] == ''){

        }

    }
}