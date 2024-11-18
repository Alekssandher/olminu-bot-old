import Eris from 'eris';
import { CommandInteraction } from 'eris';
import fs from 'node:fs'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("A variável de ambiente TOKEN não está definida.");
}

const { TOKEN } = process.env;

const COOLDOWN_TIME: number = 6 * 1000;


const Cooldowns: Map<string, number> = new Map();


const bot: any = new Eris.Client(TOKEN, {
    intents: [
        Eris.Constants.Intents.guildMessages,
        Eris.Constants.Intents.messageContent,
        Eris.Constants.Intents.guilds,
        Eris.Constants.Intents.guildMembers
    ],
    rest: {
        requestTimeout: 30000
    }
});

bot.on("ready", () => { 
    console.log("Ready!");
    
});

bot.on("error", (err: Error) => {

    console.error("typeof err",typeof(err)); 

});



bot.connect(); 


const commandFiles: string[] = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'));

console.log("Command files: ", typeof(commandFiles));
bot.commands = new Map();


for (const file of commandFiles) {
  
    const command = require(`./commands/${file}`);
    
    if (command.name) {
        bot.commands.set(command.name, command); 
        console.log(`Comando carregado: ${command.name}`); 
    } else {
        console.error(`Erro: comando sem nome no arquivo ${file}`);
    }
}


//The type of i is an object, but for some reason ts doesn't think so
bot.on("interactionCreate", async (i: CommandInteraction) => {
   
    //Then I had to add an unuseful verification
    if (i.member == undefined){return console.log('i is undefined')}

    console.log("Tipo do i", typeof(i))
    
    
    const userId: string = i.member.user.id ; 
    console.log('type of userid: ', typeof(userId))

    if (Cooldowns.has(userId)) {
        
        
        const lastExecuted: number = Cooldowns.get(userId) ?? 0;
        
        const timePassed: number = Date.now() - lastExecuted;
        
        if (timePassed < COOLDOWN_TIME) {
            const remainingTime = Math.ceil((COOLDOWN_TIME - timePassed) / 1000); 
            return i.createMessage({
                content: `Por favor, aguarde ${remainingTime} segundos antes de usar o comando novamente.`
            });
        }
    }
    
    console.time
    
    console.log(`Interação criada com o nome: ${i.data.name}`); 
    
    if (i instanceof CommandInteraction) {
        const command = bot.commands.get(i.data.name); 
        console.log(`Comando encontrado:`, command); 
        
        if (!command) {
            
            i.createMessage("Este comando não existe.");
            return;
        }

        try {
            Cooldowns.set(userId, Date.now());
            await command.execute(i); 
        } catch (error) {
            console.error(`Erro ao executar o comando ${i.data.name}:`, error);
            i.createMessage("Ocorreu um erro ao executar este comando!");
        }
    }
    console.timeEnd('Tempo')
});