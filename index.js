const Discord = require('discord.js');
const klaw = require('klaw');
const fileSync = require('fs-sync');
const config = require('./config.json');
const client = new Discord.Client();
client.config = config;
client.prefix = config.prefix;
client.developers = config.developers;
client.categories = [];
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = new Discord.Collection();
require('dotenv').config();
require('./functions.js')(client, klaw, fileSync)

client.login(process.env.TOKEN).catch(e => {console.log(e)})