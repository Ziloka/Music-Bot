const Discord = require('discord.js');
const {developers} = require('../../bot.js');

module.exports = {
    name: "template",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        return;

    }
}