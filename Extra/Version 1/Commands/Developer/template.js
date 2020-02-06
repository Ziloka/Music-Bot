const Discord = require('discord.js');

module.exports = {
    name: "template",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "template",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        return;

    }
}