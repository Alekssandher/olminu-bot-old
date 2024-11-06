const Eris = require("eris");
const { CommandInteraction} = require('eris')
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { TOKEN } = process.env;

const bot = new Eris(TOKEN, {
    intents: [
        "guildMessages",
        "messageContent",
        "guilds"
    ],
    requestTimeout: 30000
});

const prefix = "!"
bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("error", (err) => {
  console.error(err); // or your preferred logger
});

bot.on("messageCreate", (msg) => { // When a message is created
    console.log('text received')
    
    if(msg.content.toLowerCase() === "lili") { // Otherwise, if the message is "!pong"
        bot.createMessage(msg.channel.id, "Sou eu");
        // Respond with "Ping!"
    }
    if (!msg.content.startsWith("!") || msg.content === "!") return

    if(msg.content === "!ping") { // If the message content is "!ping"
        bot.createMessage(msg.channel.id, "Pong!");
        console.log('pong created')
        // Send a message in the same channel with "Pong!"
    } 
});

bot.connect(); // Get the bot to connect to Discord

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Inicialize `bot.commands` como um `Map` para armazenar os comandos
bot.commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    
    if (command.name) {
        bot.commands.set(command.name, command); // Adiciona o comando à coleção
        console.log(`Comando carregado: ${command.name}`); // Log para verificar o carregamento
    } else {
        console.error(`Erro: comando sem nome no arquivo ${file}`);
    }
}
bot.on("interactionCreate", async (i) => {
    console.log(`Interação criada com o nome: ${i.data.name}`); // Verifica o nome do comando chamado

    if (i instanceof CommandInteraction) {
        const command = bot.commands.get(i.data.name); // Obtém o comando pelo nome
        console.log(`Comando encontrado:`, command); // Verifica se o comando foi encontrado
        
        if (!command) {
            await i.createMessage("Este comando não existe.");
            return;
        }

        try {
            await command.execute(i); // Executa o comando
        } catch (error) {
            console.error(`Erro ao executar o comando ${i.data.name}:`, error);
            await i.createMessage("Ocorreu um erro ao executar este comando!");
        }
    }
});