import Eris from 'eris';
import { CommandInteraction } from 'eris';
import fs from 'node:fs'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("Ambient var (TOKEN) not defined.");
}

const { TOKEN } = process.env;

const COOLDOWN_TIME: number = 5 * 1000;


const Cooldowns: Map<string, number> = new Map();


const bot: any = new Eris.Client(TOKEN, {
    intents: [
        Eris.Constants.Intents.guildMessages,
        Eris.Constants.Intents.guilds,
    ],
    rest: {
        requestTimeout: 60000
    }
});



bot.on("debug", (info: any) => {
    console.log("Debug:", info);
  });

bot.on("error", (err: Error) => {

    console.error("Client error (bot.on)", err); 

});

bot.on("ready", () => { 
    console.log("Ready!");
    
});

bot.connect(); 

bot.options.disableEvents = {
    TYPING_START: true,  
  };

const commandFiles: string[] = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));

bot.commands = new Map();


for (const file of commandFiles) {
  
    try {
        const command = require(`./commands/${file}`);
    
    if (command.name) {
        bot.commands.set(command.name, command); 
        console.log(`Command loaded: ${command.name}`); 
    } else {
        console.error(`Error: command with no name in the file ${file}`);
    }

    } catch (error) {
        console.log(`Error loading commands: ${error}`)
    }
}

bot.on("interactionCreate", (i: CommandInteraction) => {
   
    
    if (i.member == undefined){return console.log('i is undefined')}
    
    const userId: string = i.member.user.id ; 

    if (Cooldowns.has(userId)) {
        
        
        const lastExecuted: number = Cooldowns.get(userId) ?? 0;
        
        const timePassed: number = Date.now() - lastExecuted;
        
        if (timePassed < COOLDOWN_TIME) {
            const remainingTime = Math.ceil((COOLDOWN_TIME - timePassed) / 1000); 
            return i.createMessage({
                content: `Please, wait ${remainingTime} before using a command again.`
            });
        }

        if (timePassed >= COOLDOWN_TIME) {
            Cooldowns.delete(userId);  
        } 
    }
    
    console.time("COMMAND TIME")
    
    console.log(`Interaction name: ${i.data.name}`); 
    
    if (i instanceof CommandInteraction) {
        const command = bot.commands.get(i.data.name); 
        console.log(`Command found:`, command.name); 
        
        if (!command) {
            
            i.createMessage("This command does not exist.");
            return;
        }

        try {
            Cooldowns.set(userId, Date.now());
            command.execute(i); 
        } catch (error) {
            console.error(`Erros executing the command ${i.data.name}:`, error);
            i.createMessage("There was an error while excecuting this command.");
        }
    }
    console.timeEnd("COMMAND TIME")
});