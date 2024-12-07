import Eris from 'eris';
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("A variável de ambiente TOKEN não está definida.");
}

const { TOKEN } = process.env;

const GUILD_ID: string = process.env.GUILD_ID!;
if (!GUILD_ID) { throw new Error("A variável de ambiente GUILD_ID não está definida.");}

const client: Eris.Client = new Eris.Client(TOKEN, {
    intents: [
     
    ]
  });

type CommandScope = "global" | "guild"

// Função para deletar comandos globais
async function deleteGlobalCommands(): Promise<void> {
    const commands = await client.getCommands();
    if (!commands || commands.length === 0) return console.log("Não há comandos globais para excluir.");

    for (const command of commands) {
        
        await client.deleteCommand(command.id);
        console.log(`Comando global '${command.name}' excluído.`);
        
    }
    console.log("Todos os comandos globais foram excluídos.");
}

// Função para deletar comandos da guild
async function deleteGuildCommands(): Promise<void> {
    const commands = await client.getGuildCommands(GUILD_ID);
    if (!commands || commands.length === 0) return console.log("Não há comandos da guild para excluir.");

    for (const command of commands) {
       
        await client.deleteGuildCommand(GUILD_ID, command.id);
        console.log(`Comando da guild '${command.name}' excluído.`);
        
    }
    console.log("Todos os comandos da guild foram excluídos.");
}

// Função principal para definir o tipo de exclusão com base no argumento passado
async function main() {
    await client.connect();
    client.on('ready', async () => {
        console.log("Bot conectado. Iniciando exclusão de comandos...");
        
        const action = process.argv[2] as CommandScope; // Recebe a opção passada na linha de comando
        if (action === "global") {
            await deleteGlobalCommands();
        } else if (action === "guild") {
            await deleteGuildCommands();
        } else {
            console.log("Uso: node script.ts [global|guild]");
        }
        
        client.disconnect({reconnect: false}); // Desconecta o client após a exclusão dos comandos
    });
}

main();
