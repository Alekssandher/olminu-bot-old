import { CommandInteraction, InteractionDataOptionsNumber, InteractionDataOptionsString, TextChannel } from "eris";
import { getChannelMessagesIDs } from "../utils/getChannelMessages"
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("Ambient variable TOKEN is not defined");
}

const TOKEN: string = process.env.TOKEN!
async function deleteMessages(number: number, chatId: string, i: CommandInteraction) {

        const {messagesIDs, messagesResponse} = await getChannelMessagesIDs(chatId, number)

        if (messagesResponse.status == 404) return i.createMessage(`I couldn't find this channel ${chatId} - Did you type it right?`)

        if (messagesIDs.length == 0) return i.createMessage(`There are no messages to delete in this channel: ${chatId}`)

        const messagesDeleted = messagesIDs.length

        const url = `https://discord.com/api/channels/${chatId}/messages/bulk-delete`;

        const headers = {
            Authorization: `Bot ${TOKEN}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(url, {
            method: "POST", 
            headers,
            body: JSON.stringify({ messages: messagesIDs })
        });

        console.log("resposta",response)

        if (response.status == 403) return i.createMessage("It looks like i don't have enough permissions to clear messages >:(")

        if (!response.ok) return i.createMessage({
            
            content: "Internal error, oh hell!",
            flags: 64
        })
        else {
            return i.createMessage(`${messagesDeleted} messages deleted in this chat: ${chatId}`)
        }
        
        
}
module.exports = {
    name: "clear",
    description: "Clear chat messages",
    options: [
        {
            name: "number",
            description: "Number of messages to clear.",
            type: 10,
            required: true
            
        },
        {
            name: "chat",
            description: "ID of the chat to be cleared.",
            type: 3,
            required: false
        }
    ],
    default_member_permissions: 'MANAGE_MESSAGES',
    execute: async (i: CommandInteraction) => {

        if (!i.data.options) return

        if (!i.channel || !("guild" in i.channel)) {
            return i.createMessage("This command can only be used in a server channel.");
        }
        
        let number = (i.data.options.find(opt => opt.name === 'number') as InteractionDataOptionsNumber ).value
        
        if (number == 1) return i.createMessage("If you just want to delete 1 message, why are you using this command?")
            
        if(number > 100){
            return i.createMessage("Unfortunately I can just delete 100 messages at a time >:(")
        }

        const chat = (i.data.options.find(opt => opt.name === 'chat') as InteractionDataOptionsString || undefined)

        
        const chatId = chat
        ?chat.value
        :i.channel.id
        
        const channels = i.channel.guild.channels

        const channel = channels.find(ch => ch.id === chatId && (ch.type === 0 || ch.type === 5));

        if(!channel) return i.createMessage(`I couldn't find this channel: ${chatId}`)

        await deleteMessages(number, chatId, i)

    }
    
}