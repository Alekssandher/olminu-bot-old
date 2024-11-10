const wiki = require('wikipedia');


const cache = new Map();

const search = async (target, opLang) => {
    try {
       
        let lang = ""

        // if (cache.has(target)) {
        //     return cache.get(target);
        // }
        if(opLang){
            lang = opLang
        }
        
        await wiki.setLang(lang);
        const timePassed = new Date()
        const searchResults = await wiki.search(target, { suggestion: true, limit: 10 });
        console.log(`A pesquisa levou: ${new Date() - timePassed}ms`)


        if (!searchResults.results || searchResults.results.length === 0) {
            return 
            
        }

        const firstResultTitle = searchResults.results[0].title;
        const page = await wiki.page(firstResultTitle);

      
        const [title, response, url] = await Promise.all([
            page.title,
            page.summary(),
            page.fullurl
        ]);
        const text = response.extract;
        
       
        const result = { title, text, url };
        
        
        return result;
    } catch (error) {
        console.error("Erro na busca Wikipedia:", error);
        throw error;
    }
};


module.exports = {
    name: "wiki",
    description: "Get information from Wikipedia",
    options: [
        {
            name: "termo",
            description: "sua pesquisa",
            type: 3,
            required: true
        },
        {
            name: "language",
            description: "type a language like pt, en, rs",
            type: 3,
            required: false
        }
    ],
    execute: async (i) => {
        try {            
            await i.acknowledge();
            const searchTerm = i.data.options.find(opt => opt.name === 'termo').value;
            const langOp = i.data.options.find(opt => opt.name === 'language')
            
            let lang
           
            if (!langOp){lang = "pt";} else {lang = i.data.options.find(opt => opt.name === 'language').value}

            console.log("Lingua: ",lang);
            const page = await search(searchTerm, lang);

            if (!page){
                i.createMessage({
                    content: "Ops, parece que sua pesquisa não foi encontrada."
                    
                })
                return
            }
            const { title, text, url } = page;

            i.createMessage({
                embeds: [{
                    title: title,
                    description: text,
                    url: url
                }]
            });
        } catch (error) {
            console.error("Erro ao executar comando wiki:", error);
            i.createMessage({
                content: "Ocorreu um erro ao buscar informações na Wikipedia. Por favor, tente novamente mais tarde."
            });
        }
    }
};
