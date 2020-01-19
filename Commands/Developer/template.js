const Discord = require('discord.js');

module.exports = {
    name: "template",
    category: client => __filename.slice(__filename.search(client.categories.find(categoryName => __filename.includes(categoryName)))).split('\\')[0],
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        return;

    }
}