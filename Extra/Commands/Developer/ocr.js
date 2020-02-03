const Discord = require('discord.js');
const tesseract = require('tesseract.js');

module.exports = {
    name: "ocr",
    category: __dirname.slice(__dirname.lastIndexOf("\\")).slice(1),
    path: __filename,
    description: "Optical Character reading",
    argRequirements: args => !!args.length,
    run: async (client, message, args) => {

        if(client.developers.find(ID => ID == message.author.id) == undefined) return;
        if(message.attachments.size == 0) return message.channel.send('Cannot read text from no image!')
        let attachment = message.attachments.first().url
        let msg = await message.channel.send('Getting text from image...')
        let worker = tesseract.createWorker({
            // logger: m => console.log(m)
        });
        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const {data: { text } } = await worker.recognize(attachment);
            message.channel.send(text);
            msg.delete();
            await worker.terminate();
        })()
    }
}