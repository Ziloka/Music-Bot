const Discord = require('discord.js');
const asciiArt = require('ascii-art');

module.exports = {
    name: "test",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "test",
    argRequirements: args => !args.length,
    run: async (client, message, args) => {

        asciiArt.font

        return message.channel.send(`\`\`\`js\n\`\`\``)

    }
}