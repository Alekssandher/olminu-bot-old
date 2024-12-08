import { CommandInteraction, InteractionDataOptionsNumber, InteractionDataOptionsString, Message } from "eris";
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

        let number = (i.data.options.find(opt => opt.name === 'number') as InteractionDataOptionsNumber ).value

        

        if(number > 100){
            return i.createMessage("Unfortunately I can just delete 100 messages once >:(")
        }

        const chat = (i.data.options.find(opt => opt.name === 'chat') as InteractionDataOptionsString || undefined)

        const chatId = chat
        ?chat
        :i.channel.id
        

        let messages: Message[] = []
        let numberOfMessages: Number = 0

        if(number <= 100) {
            const fetchedMessages = await i.channel.getMessages({
                limit: number
            })
            
            numberOfMessages = fetchedMessages.length

            messages = messages.concat(fetchedMessages);

            console.log(messages)

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