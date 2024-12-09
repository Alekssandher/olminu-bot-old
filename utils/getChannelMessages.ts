import dotenv from 'dotenv'
import { CommandInteraction } from 'eris';
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("Ambient variable TOKEN is not defined");
}

const TOKEN: string = process.env.TOKEN!

export async function getChannelMessagesIDs(chatId: string, limit: number) {
    const url = `https://discord.com/api/channels/${chatId}/messages?limit=${limit}`;

    const headers = {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json"
    };

    const messagesResponse = await fetch(url, {
        method: "GET", 
        headers
    });
    
    
    const messages = await messagesResponse.json() 

    const messagesIDs = Array.isArray(messages) ? messages.map((message: { id: string }) => message.id) : [];
    
    return {messagesIDs, messagesResponse}
}

