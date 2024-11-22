import { CommandInteraction } from "eris";

module.exports  = {
    name: 'ping',
    description: 'replies with ping',

    execute: (i: CommandInteraction) => {
        
        i.createMessage('Pong!');
    }
}
