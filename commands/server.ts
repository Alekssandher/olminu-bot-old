import { CommandInteraction, Guild, User } from "eris";

module.exports = {
    name: 'server-information',
    description: 'show server information!',
    execute: async (i: CommandInteraction) => {


      if (!i.channel || !("guild" in i.channel)) {
        return i.createMessage("This command can only be used in a server channel.");
      }

      if (!i.member) {
        return i.createMessage("Could not retrieve member information.");
      }

      const guild: Guild = i.channel.guild
      
      const member: User = i.member.user
      
      const createdAtDate: Date = new Date(guild.createdAt);
      const createdAtFormatted: string = createdAtDate.toLocaleString();
      
      i.createMessage({
          embeds: [{
            
            title: "Server Information", 
            description: "Here is some more info, with **awesome** formatting.\nPretty *neat*, huh?",
            author: { 
              name: member.username,
              icon_url: i.member.avatarURL,
            },
            color: 0x008000, 
            fields: [ 
              {
                name: "Server name", 
                value: `${guild.name}`, 
                inline: true,
              },
              {
                name: "This server was created at",
                value: createdAtFormatted,
                inline: true,
              },
            ],
            footer: { 
              text: "Just the footer.",
            },
          }],
      })
    }
}
