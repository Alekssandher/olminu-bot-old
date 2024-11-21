
import Eris from 'eris';
import fs from 'node:fs'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("A variável de ambiente TOKEN não está definida.");
}

const { TOKEN } = process.env;
const GUILD_ID: string = process.env.GUILD_ID!;
const Constants = Eris.Constants;

const client: Eris.Client = new Eris.Client(TOKEN, {
  intents: [
   
  ]
});

async function registerOrEditCommands(scope: string) {
    console.log(`Carregando comandos para o escopo: ${scope}`);
    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.ts'));
    
    
    const registeredCommands = scope === "guild"
        ? await client.getGuildCommands(GUILD_ID)
        : await client.getCommands();
    
    
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        if (!command.name) {
            console.error(`Comando sem nome encontrado no arquivo: ${file}`);
            continue;
        }

       
        const existingCommand = registeredCommands.find(c => c.name === command.name);

        

        if (existingCommand) {
           
            if (scope === "guild") {
                await client.editGuildCommand(GUILD_ID, existingCommand.id, {
                    name: command.name,
                    description: command.description,
                    options: command.options                    
                });
            } else {
                await client.editCommand(existingCommand.id, {
                    name: command.name,
                    description: command.description,
                    options: command.options
                    
                });
            }
            console.log(`Comando '${command.name}' atualizado no escopo ${scope}.`);
        } else {
           
            if (scope === "guild") {
                await client.createGuildCommand(GUILD_ID, {
                    name: command.name,
                    description: command.description,
                    options: command.options,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT
                });
            } else {
                await client.createCommand({
                    name: command.name,
                    description: command.description,
                    options: command.options,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT
                });
            }
            console.log(`Comando '${command.name}' registrado no escopo ${scope}.`);
        }
    }
    console.log(`Todos os comandos foram carregados e atualizados no escopo ${scope}!`);
}


async function main() {
    const scope = process.argv[2]; 

    if (!["guild", "global"].includes(scope)) {
        console.error("Por favor, especifique o escopo como 'guild' ou 'global'.");
        process.exit(1);
    }

    await client.connect();
    client.on("ready", async () => {
        console.log(`Bot conectado como ${client.user.username}`);
        await registerOrEditCommands(scope);
        client.disconnect({reconnect: false});
    });
}

main().catch(console.error);
