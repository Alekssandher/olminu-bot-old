const Eris = require('eris');
require('dotenv').config();

const { TOKEN, GUILD_ID } = process.env;
const bot = new Eris(TOKEN);

// Função para deletar comandos globais
async function deleteGlobalCommands() {
    const commands = await bot.getCommands();
    if (!commands || commands.length === 0) return console.log("Não há comandos globais para excluir.");

    for (const command of commands) {
        
        await bot.deleteCommand(command.id);
        console.log(`Comando global '${command.name}' excluído.`);
        
    }
    console.log("Todos os comandos globais foram excluídos.");
}

// Função para deletar comandos da guild
async function deleteGuildCommands() {
    const commands = await bot.getGuildCommands(GUILD_ID);
    if (!commands || commands.length === 0) return console.log("Não há comandos da guild para excluir.");

    for (const command of commands) {
       
        await bot.deleteGuildCommand(GUILD_ID, command.id);
        console.log(`Comando da guild '${command.name}' excluído.`);
        
    }
    console.log("Todos os comandos da guild foram excluídos.");
}

// Função principal para definir o tipo de exclusão com base no argumento passado
async function main() {
    await bot.connect();
    bot.on('ready', async () => {
        console.log("Bot conectado. Iniciando exclusão de comandos...");
        
        const action = process.argv[2]; // Recebe a opção passada na linha de comando
        if (action === "global") {
            await deleteGlobalCommands();
        } else if (action === "guild") {
            await deleteGuildCommands();
        } else {
            console.log("Uso: node script.js [global|guild]");
        }
        
        bot.disconnect(); // Desconecta o bot após a exclusão dos comandos
    });
}

main();
