const { Collection, CommandInteraction} = require("eris");
const Eris = require('eris')
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { TOKEN, GUILD_ID } = process.env;


const Constants = Eris.Constants;
const client = new Eris(TOKEN, {
  intents: [
   
  ]
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
  console.log('Loading commands...');
  client.commands = new Collection();

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  console.log(commandFiles)
  for (const file of commandFiles) {

      const command = (await require(`./commands/${file}`));
    
      if (!command.name) {
          console.error(`Comando sem nome encontrado: ${file}`);
          continue;
      }
      client.createCommand( {
          name: command.name,
          description: command.description,
          type: Constants.ApplicationCommandTypes.CHAT_INPUT,
         
      });
      
  }
  console.log('Commands loaded!');
});

client.on('error', (err) => {
  console.error(err); // or your preferred logger
});

client.on('interactionCreate', async (i) => {
  if (i instanceof CommandInteraction) {
      if (!client.commands.has(i.data.name)) return i.createMessage('This command does not exist.');

      try {
          await client.commands.get(i.data.name).execute(i);
      }
      catch (error) {
          console.error(`message error: ${error}`);
          await i.createMessage('There was an error while executing this command!');
      }
  }
});

client.connect()