const Eris = require("eris");
const { CommandInteraction} = require('eris')
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const { TOKEN } = process.env;
const COOLDOWN_TIME = 6 * 1000;

const Cooldowns = new Map();

const bot = new Eris(TOKEN, {
    intents: [
        "guildMessages",
        "messageContent",
        "guilds",
        "getAllUsers"
    ],
    requestTimeout: 30000
});

const prefix = "!"
bot.on("ready", () => { 
    console.log("Ready!"); 
});

bot.on("error", (err) => {
  console.error(err); 
});


bot.connect(); 

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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


bot.on("interactionCreate", async (i) => {
   
    await i.acknowledge();
    console.log(i)
    const userId = i.member.user.id; 

    if (Cooldowns.has(userId)) {
        const lastExecuted = Cooldowns.get(userId);
        const timePassed = Date.now() - lastExecuted;

        if (timePassed < COOLDOWN_TIME) {
            const remainingTime = Math.ceil((COOLDOWN_TIME - timePassed) / 1000); 
            return i.createMessage({
                content: `Por favor, aguarde ${remainingTime} segundos antes de usar o comando novamente.`
            });
        }
    }

    console.log(`Interação criada com o nome: ${i.data.name}`); 
    
    if (i instanceof CommandInteraction) {
        const command = bot.commands.get(i.data.name); 
        console.log(`Comando encontrado:`, command); 
        
        if (!command) {
            
            await i.createMessage("Este comando não existe.");
            return;
        }

        try {
            Cooldowns.set(userId, Date.now());
            await command.execute(i); 
        } catch (error) {
            console.error(`Erro ao executar o comando ${i.data.name}:`, error);
            await i.createMessage("Ocorreu um erro ao executar este comando!");
        }
    }
});