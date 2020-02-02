require('dotenv').config();
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN });
// const manager = new ShardingManager('./bot.js', { respawn: false , token: process.env.TOKEN });

manager.spawn().catch(e => { console.log(e) }) 
manager.on('shardCreate', shard => { console.log(`Launched shard ${shard.id}`) }); 