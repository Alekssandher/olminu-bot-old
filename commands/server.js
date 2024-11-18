

module.exports = {
    name: 'server-information',
    description: 'show server information!',
    execute: async (i) => {
        const guild = i.channel.guild
        const member = i.member.user
        const createdAtDate = new Date(guild.createdAt);
        const createdAtFormatted = createdAtDate.toLocaleString();
       
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
                  text: "Created with Eris.",
                },
              }],
        })
    }
}
