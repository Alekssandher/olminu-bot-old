export async function searchUserInGuild(guildId: string, username: string, TOKEN: string) {
    const urlByName: string = `https://discord.com/api/guilds/${guildId}/members/search?query=${username}&limit=1`
    

    const headers = {
        Authorization: `Bot ${TOKEN}`
    }


    const response: Response = await fetch(urlByName, { headers })

    if (!response.ok) {
        console.error("Failed to fetch user:", response.statusText);
        return;
    }

    const data: any = await response.json()

    if (Array.isArray(data) && data.length === 0){
        const urlById: string = `https://discord.com/api/guilds/${guildId}/members/${username.replace(/[@<>]/g, '')}`

        console.log('data is empty trying other')

        const fallBackResponse = await fetch(urlById, {headers})
        
        const fallbackData = await fallBackResponse.json()

        console.log("eis o fallback: ",fallbackData)
        return fallbackData
    }  

    console.log("result getGuildUser: ", data)

    return data
}
