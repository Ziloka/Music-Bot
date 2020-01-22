const Discord = require('discord.js');
const util = require('util');
const fetch = require('node-fetch');
const childProcess = require('child_process');
const {developers} = require('../../bot.js');
const program = require('commander');
program.version('0.0.1');

module.exports = {
    name: "exec",
    usage: "exec <code>",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    description: "evaulates stuff in javascript",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

    if(developers.find(ID => ID == message.author.id) == undefined) return;
    if(args.join(' ').length == 0) return message.channel.send('Cannot execute nothing!')

    childProcess.exec(args.join(' '), async function(d){
        console.log(d)
    })

    }
}