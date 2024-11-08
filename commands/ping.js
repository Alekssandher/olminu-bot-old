
module.exports  = {
    name: 'ping',
    description: 'replies with ping!',
   
    cooldown: 3000,
    execute: async (i) => {
        i.createMessage('Pong!');
    }
}
