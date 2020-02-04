// const {client} = require('../../bot.js');

module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldMember, newMember) => {

        if(oldMember.voiceChannel == undefined) return;
        if(client.queue.has(oldMember.guild.id) == false) return;
        if(oldMember.voiceChannel.members.has(client.user.id) == false) return;
        if(oldMember.voiceChannel.members.size > 1 && oldMember.voiceChannel.members.has(client.user.id)) return;
        try{
            client.player.leave(oldMember.guild.id);
            client.queue.delete(oldMember.guild.id);
        }catch(e){
            return;
        }
    })
}