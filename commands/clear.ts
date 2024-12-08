import { CommandInteraction, InteractionDataOptionsNumber, InteractionDataOptionsString, Message, TextChannel } from "eris";
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.TOKEN) {
    throw new Error("Ambient variable TOKEN is not defined");
}

const TOKEN: string = process.env.TOKEN!

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

        

        if(number > 100){
            return i.createMessage("Unfortunately I can just delete 100 messages once >:(")
        }

        const chat = (i.data.options.find(opt => opt.name === 'chat') as InteractionDataOptionsString || undefined)

        console.log("chat: ", chat)
        const chatId = chat
        ?chat.value
        :i.channel.id
        
        const channels = i.channel.guild.channels

        const channel = channels.find(ch => ch.id === chatId && (ch.type === 0 || ch.type === 5));

        console.log("channel: ", channel)

        if(!channel) return i.createMessage(`I couldn't find this chat ${chatId} - did you type it right?`)

        let messages: Message[] = []
        let numberOfMessages: Number = 0

        if (!channel || !(channel instanceof TextChannel)) {
            return i.createMessage(`I couldn't find a valid chat with ID ${chatId} or it is not a text channel.`);
        }

        if(number <= 100) {
            const fetchedMessages = await channel.getMessages({
                limit: number
            })
            
            numberOfMessages = fetchedMessages.length

            messages = messages.concat(fetchedMessages);


            if(messages.length == 0) return i.createMessage("There are no messages to delete")

            if(messages.length < number ) number = messages.length 

            console.log("Counts: ", messages.length, number)

            messages.slice(0, number).forEach(message => {
                
                message.delete();
            });

            return i.createMessage(`${number} messages deleted in this chat: ${chatId}`)
        }

    }
    
}