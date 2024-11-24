import { CommandInteraction, Guild, Member, User} from "eris";
import dotenv from 'dotenv'

dotenv.config()

const CLIENT_ID: string = process.env.CLIENT_ID!
const TOKEN: string = process.env.TOKEN!

async function getUserInfo(userId: string) {
  const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch user:", response.statusText);
    return;
  }

  const user: any = await response.json();
  return user
}

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

      const owner: User = await getUserInfo(guild.ownerID)
      
      const createdAt: number = Math.floor(guild.createdAt / 1000)
      
      const memberCount: number = guild.memberCount
      
      const textChannelsCount: number = guild.channels.filter(channel => channel.type === 0).length;
      const voiceChannelsCount: number = guild.channels.filter(channel => channel.type === 2).length
      const channelsCount: number = textChannelsCount + voiceChannelsCount

      const botMember = guild.members.get(CLIENT_ID) as Member
      
      if (!botMember || !botMember.joinedAt) {
        console.log('Bot member or joinedAt undefined', botMember)
        return i.createMessage('Something really bad happened, please report')
      }
      

      const botJoinedAt: number = Math.floor(botMember.joinedAt /1000)

      i.createMessage({
          embeds: [{
            
            title: guild.name,
            thumbnail: {
              url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`
            },
            color: 15395529, 
            fields: [ 
              {
                name: "ID", 
                value: `${guild.id}`, 
                inline: true,
              },
              {
                name: "Owner",
                value: `\`\`@${owner.username}\`\` (${guild.ownerID})`,
                inline: true
              },
              {
                name: "Created at",
                value: `<t:${createdAt}:f> (<t:${createdAt}:R>)`,
                inline: true,
              },
              {
                name: `Channels (${channelsCount})`,
                value: `Text channels: ${textChannelsCount}\n Voice channels: ${voiceChannelsCount}`,
                inline: true
              },
              {
                name: 'Members',
                value: `${memberCount}`,
                inline: true
              },
              {
                name: 'I joined at',
                value: `<t:${botJoinedAt}:f> (<t:${botJoinedAt}:R>)`,
                inline: true
              }
            ],
            footer: {
              text: i.member.user.globalName as string
          },                    
          timestamp: new Date().toISOString()
          }],
      })


    }
}
