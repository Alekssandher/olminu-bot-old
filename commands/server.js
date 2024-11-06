

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
                title: "Server Information", // Title of the embed
                description: "Here is some more info, with **awesome** formatting.\nPretty *neat*, huh?",
                author: { // Author property
                  name: member.username,
                  icon_url: i.member.avatarURL,
                },
                color: 0x008000, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                  {
                    name: "Server name", // Field title
                    value: `${guild.name}`, // Field
                    inline: true, // Whether you want multiple fields in same line
                  },
                  {
                    name: "This server was created at",
                    value: createdAtFormatted,
                    inline: true,
                  },
                ],
                footer: { // Footer text
                  text: "Created with Eris.",
                },
              }],
        })
    }
}
