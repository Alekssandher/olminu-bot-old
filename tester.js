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

client.on("ready", async () => {
    try {
        const guildID = GUILD_ID
        await client.deleteGuildCommand(GUILD_ID, "animal", {
           

        })
    } catch (error) {
        console.log(`deu ruim: ${error}`)
    }
})


client.connect()