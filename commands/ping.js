
module.exports  = {
    name: 'ping',
    description: 'replies with ping!',
    execute: async (i) => {
        i.createMessage('Pong!');
    }
}
