require('dotenv').config()
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { respawn: false , token: process.env.TOKEN });

manager.spawn();
manager.on('launch', shard => {console.log(`Launched shard ${shard.id}`)});