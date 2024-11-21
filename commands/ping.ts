import { CommandInteraction } from "eris";

module.exports  = {
    name: 'ping',
    description: 'replies with ping',

    execute: async (i: CommandInteraction) => {
        
        i.createMessage('Pong!');
    }
}
