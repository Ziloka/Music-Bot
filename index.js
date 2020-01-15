const Discord = require('discord.js');
const klaw = require('klaw');
const fileSync = require('fs-sync');
const {prefix} = require('./botconfig.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Discord.Collection();
require('dotenv').config();
require('./functions.js')(client, klaw, fileSync)

client.login(process.env.TOKEN)

module.exports = {
    client: client,
    prefix: prefix
}