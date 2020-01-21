const {client} = require('../../bot.js');

client.on('voiceStateUpdate', async (oldMember, newMember) => {

    if(oldMember.voiceChannel == undefined) return;
    if(client.queue.has(oldMember.guild.id) == false) return;
    if(oldMember.voiceChannel.members.size > 1) return; 
    try{client.queue.delete(oldMember.guild.id);oldMember.voiceChannel.leave()}catch(e){return;}

})