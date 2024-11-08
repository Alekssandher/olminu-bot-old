const wiki = require('wikipedia');


const search = async (params) => {
    try {
        await wiki.setLang('pt')
		const page = await wiki.page(params);
        
        
		
		const title = await page.title
        const response = await page.summary()
        const text = await response.extract
        
        console.log("respnse: ", response)

        const body = {title, text}
        return body 
	} catch (error) {
		console.log(error);
		//=> Typeof wikiError
	}
}


module.exports = {
    
    name: "wiki",
    description: "Make a research on the wikipedia",
    options: [
        {
            name: "termo",
            description: "sua pesquisa",
            type: 3,
            required: true
        },
    ],
    execute: async(i) => {

        

        console.log("Termos: ", i.data.options)
        const searchTerm = i.data.options.find(opt => opt.name === 'termo').value;
        const page = await search(searchTerm)

        const title = page.title
        const text = page.text
        console.log("Descrição: ", text)

        i.createMessage({
            
            embeds: [{
                title: `${title}`,
                description: text

            }]
        });
    }
}