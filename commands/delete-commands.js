const Eris = require('eris');
require('dotenv').config();

const { TOKEN, GUILD_ID } = process.env;
const bot = new Eris(TOKEN);

bot.on('ready', async () => {
    console.log('Bot está online!');
});

// Funções para deletar comandos
async function deleteGlobalCommands() {
    const commands = await bot.getCommands();
    if (!commands || commands.length === 0) return console.log(`Não há comandos globais para excluir: ${commands}`);

    commands.forEach(command => {
        if (command != 'delete-commands'){
            console.log(command)
            bot.deleteCommand(command.id);

        }
    });
    console.log('Todos os comandos globais foram excluídos.');
}

async function deleteGuildCommands() {
    const commands = await bot.getGuildCommands(GUILD_ID);
 
    if (!commands || commands.length === 0) return console.log(`Não há comandos da guild para excluir: ${commands}`);
    
    commands.forEach(async command => {
        console.log(`Comando da vez: ${command.name}`)
        if(command.name == 'delete-commands') return console.log(command.name)
        await bot.deleteGuildCommand(GUILD_ID, command.id);
    });
    console.log('Todos os comandos da guild foram excluídos.');
}

// Exibe o menu de seleção
module.exports = {
    name: "delete-commands",
    description: "Delete the commands",
    execute: async(i) => {
        i.createMessage({
            content: "Escolha o tipo de comandos para deletar:",
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "select",
                    options: [
                        {
                            label: "Deletar Comandos Globais",
                            value: "global"
                        },
                        {
                            label: "Deletar Comandos da Guild",
                            value: "guild"
                        }
                    ],
                    placeholder: "Escolha uma opção",
                    min_values: 1,
                    disabled: false
                    
                }]
            }]
        });
    }
                   
    
};

// Listener para interações
bot.on('interactionCreate', async (interaction) => {
    if (interaction.type === Eris.Constants.InteractionTypes.MESSAGE_COMPONENT && interaction.data.custom_id === "select") {
        const selectedValue = interaction.data.values[0];

        if (selectedValue === "global") {
            await deleteGlobalCommands();
            await interaction.createMessage("Comandos globais deletados.");
        } else if (selectedValue === "guild") {
            await deleteGuildCommands();
            await interaction.createMessage("Comandos da guild deletados.");
        }
        
    }
});

bot.connect();
