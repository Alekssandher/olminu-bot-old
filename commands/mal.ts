
import { CommandInteraction, InteractionDataOptions, InteractionDataOptionsString, Member } from "eris"

async function animeSearch(terms: string) {
    try {
        
        const response = await fetch(`https://api.jikan.moe/v4/anime/?q=${terms}`)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: any = await response.json()

        if (!data) return

        return data.data[0]


    } catch (error) {
        console.error('Error looking for the data:', error)
    }
}

async function characterSearch(terms: string) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/characters/?q=${terms}`)

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: any = await response.json()

    if (!data) return 

    return data.data[0]

    } catch (error) {
        console.error('Error looking for the data:', error)
    }
}

module.exports = {
    name: "mal",
    description: "Make a research on the my anime list",
    options: [
        {
            name: "kind",
            description: "Are you looking for an anime or a character?",
            type: 3,
            required: true,
            choices: [
                {name: "Anime", value: "anime"},
                {name: "Character", value: "character"}
            ]
        },
        {
            name: "terms",
            description: "Type your anime/char name",
            type: 3,
            required: true
        }
    ],
    execute: async (i: CommandInteraction) => {
        if (!i.data.options) return

        const options: InteractionDataOptions[] = i.data.options

        const kind = options.find(option => option.name === 'kind') as InteractionDataOptionsString | undefined
        const terms = options.find(option => option.name === 'terms') as InteractionDataOptionsString | undefined

        
        if (!kind || !terms) {
            i.createMessage({
                content: "It looks like there's something up with your command.",
                flags: 64
            })
            return console.log('kind or terms empty')
            
        }

        const termsTreated: string = terms.value.toLowerCase();

        const member =  i.member as Member | null

        if (!member) return i.createMessage('A big error has ocurred oh helll!!')

        const username = member.user.globalName as string

        switch (kind.value) {
            case 'anime':
                const researchResult = await animeSearch(termsTreated)

                if (!researchResult || !researchResult.title) return i.createMessage('Not found, did you type it right?')

                

                await i.createMessage({
                    embeds: [{
                        title: researchResult.title,
                        url: researchResult.url,
                        thumbnail: {
                            url: researchResult.images.jpg.image_url
                            
                        },
                        color: 15395529,
                        fields: [
                            {
                              name: "Score & Ranking",
                              value: `**Score:** ${researchResult.score} \n**Ranking:** #${researchResult.rank}`,
                              inline: true,
                            },
                            {
                              name: "Genres",
                              value: researchResult.genres.map((genre: any) => genre.name).join(", "),
                              inline: true,
                            },
                            {
                              name: "Release date",
                              value: researchResult.aired.string,
                              inline: true,
                            },
                            {
                                name: "Status",
                                value: researchResult.status,
                                inline: true
                            },
                            {
                              name: "Episodes quantity",
                              value: `${researchResult.episodes || "Unknown"}`,
                              inline: true,
                            },
                            {
                              name: "Duration per ep",
                              value: researchResult.duration,
                              inline: true,
                            },
                            {
                              name: "Studio",
                              value: researchResult.studios[0]?.name || "Unknown",
                              inline: true,
                            },
                            {
                              name: "Synopsis",
                              value: researchResult.synopsis
                                ? researchResult.synopsis.split('\n')[0].substring(0, 1020) + '...'
                                : "No synopses available.",
                            },
                            {
                                name: "Background",
                                value: researchResult.background
                                ? researchResult.background.split('\n')[0].substring(0, 1020) + '...'
                                : "No background available.",
                                                                                                   
                            }
                        ],
                        footer: {
                            text: `${username} - Informations from My Anime List`
                        },                    
                        timestamp: new Date().toISOString()
           
                    }
                ]
                });
                if (termsTreated === 'drifters') {
                    await i.createMessage('Did you know my name is inspered by the drifters character Olminu?')
                }
                break;
            
            case 'character':
                const char = await characterSearch(termsTreated)
                console.log(char)
                if (!char || !char.name) return i.createMessage({
                    content: 'Not found, did you type it right?',
                    flags: 64
                })
                
                await i.createMessage({
                    embeds: [
                        {
                            title: char.name,
                            url: char.url,
                            thumbnail: {
                                url: char.images.jpg.image_url
                                
                            },
                            fields: [
                                {
                                    name: "Name",
                                    value: char.name,
                                    inline: true
                                },
                                {
                                    name: "Kanji Name",
                                    value: char.name_kanji || 'This character has no kanji name',
                                    inline: true
                                },
                                {
                                    name: "Nickname",
                                    value: char.nicknames[0] || `${char.name} has no nickname.`,
                                    inline: true
                                },
                                {
                                    name: "About",
                                    value: char.about
                                    ? char.about.substring(0, 1020)+ "..."
                                    : 'This character has no about',                           
                                
                                }
                            ],
                            footer: {
                                text: `${username} - Informations from My Anime List`
                            },                    
                            timestamp: new Date().toISOString()
                        }                        
                    ]
                })

                if (termsTreated === 'olminu') await i.createMessage('Is that me?')
                break;
            default:
                i.createMessage({
                    content: "***Your ip was saved on our database, we know that you are trying to do something wrong, what a bad guy you are.***",
                    flags: 64
                });
                break;
        }

    }
}